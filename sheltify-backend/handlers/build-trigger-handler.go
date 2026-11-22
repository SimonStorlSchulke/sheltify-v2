package handlers

import (
	"database/sql"
	"fmt"
	"net/http"
	"os"
	"os/exec"
	"path/filepath"
	"sheltify-backend/repository"
	"sheltify-backend/services"
	"sort"
	"sync"
	"time"
)

// Zero-downtime build of the static client sites.
//
// The site is served from <sitesRoot>/client-<tenant>. That path is a symlink pointing to the
// currently live release:
//
//	/var/www/sheltify/client-snhg -> client-snhg-releases/20261122-153000
//
// A build goes into a new release directory. Only after astro AND pagefind succeeded, the
// symlink is replaced atomically (new symlink + rename over the old one). Until then the old
// release stays online, and a failed build never touches the live site.

const (
	defaultSitesRoot = "/var/www/sheltify"
	// number of releases kept per tenant (the live one included), older ones are deleted
	keptReleases = 2
)

var (
	buildLocksMu sync.Mutex
	buildLocks   = map[string]*sync.Mutex{}
)

// sitesRoot is the directory containing the served client sites. Can be overridden with the
// environment variable SITES_ROOT.
func sitesRoot() string {
	if root := os.Getenv("SITES_ROOT"); root != "" {
		return root
	}
	return defaultSitesRoot
}

func tenantBuildLock(tenantID string) *sync.Mutex {
	buildLocksMu.Lock()
	defer buildLocksMu.Unlock()
	lock, ok := buildLocks[tenantID]
	if !ok {
		lock = &sync.Mutex{}
		buildLocks[tenantID] = lock
	}
	return lock
}

func TriggerAstroSiteBuild(w http.ResponseWriter, r *http.Request) {
	user := services.UserFromRequest(r)

	// Two builds of the same tenant at once would race on the symlink swap.
	lock := tenantBuildLock(user.TenantID)
	if !lock.TryLock() {
		internalServerErrorResponse(w, r, "Die Seite wird gerade schon gebaut. Bitte warten, bis der laufende Build fertig ist.")
		return
	}
	defer lock.Unlock()

	liveLink := filepath.Join(sitesRoot(), "client-"+user.TenantID)
	releasesDir := liveLink + "-releases"
	releaseDir := filepath.Join(releasesDir, time.Now().Format("20060102-150405"))

	if err := os.MkdirAll(releasesDir, 0o755); err != nil {
		internalServerErrorResponse(w, r, "Build-Verzeichnis konnte nicht angelegt werden. Bitte Administrator melden. Fehler: "+err.Error())
		return
	}

	// Build into the new release directory. --outDir overrides the outDir of the site's astro config.
	cmd := exec.Command("npm", "run", "build:"+user.TenantID, "--", "--outDir", releaseDir)
	cmd.Stdout = w
	cmd.Stderr = os.Stderr
	cmd.Stdin = os.Stdin
	cmd.Dir = "../clients"

	if err := cmd.Run(); err != nil {
		os.RemoveAll(releaseDir)
		internalServerErrorResponse(w, r, "Seite konnte nicht gebaut werden, die bisherige Version bleibt online. Bitte Administrator melden. Fehler: "+err.Error())
		return
	}

	// Build the search index for the freshly built site, before it goes live.
	pagefindCmd := exec.Command("npx", "pagefind", "--site", releaseDir)
	pagefindCmd.Stdout = w
	pagefindCmd.Stderr = os.Stderr
	pagefindCmd.Dir = "../clients" // pagefind is a dependency of the clients package

	if err := pagefindCmd.Run(); err != nil {
		os.RemoveAll(releaseDir)
		internalServerErrorResponse(w, r, "Suchindex konnte nicht erstellt werden, die bisherige Version bleibt online. Bitte Administrator melden. Fehler: "+err.Error())
		return
	}

	if err := activateRelease(liveLink, releaseDir); err != nil {
		internalServerErrorResponse(w, r, "Seite wurde gebaut, konnte aber nicht veröffentlicht werden. Bitte Administrator melden. Fehler: "+err.Error())
		return
	}

	if err := cleanupOldReleases(releasesDir, releaseDir); err != nil {
		// not critical, the new site is already live
		fmt.Fprintln(os.Stderr, "could not clean up old releases:", err)
	}

	tenantonfig, err := repository.GetConfigByTenantId(user.TenantID)

	if err == nil {
		tenantonfig.LastBuild = sql.NullTime{
			Time:  time.Now(),
			Valid: true,
		}
		tenantonfig.NeedsRebuild = false
		err = repository.SaveTenantConfiguration(tenantonfig)
	}

	if err != nil {
		internalServerErrorResponse(w, r, "Seite wurde gebaut, Tenantconfiguration könnte aber nicht gespeichert werden")
		return
	}

	emptyOkResponse(w)
}

// activateRelease atomically points liveLink to releaseDir.
func activateRelease(liveLink, releaseDir string) error {
	// Relative target, so the link keeps working if the sites root is moved or mounted elsewhere.
	target, err := filepath.Rel(filepath.Dir(liveLink), releaseDir)
	if err != nil {
		target = releaseDir
	}

	// Migration: before the first zero-downtime build liveLink is a real directory. Move it into
	// the releases dir, so it can be replaced by the symlink (this one time with a gap of a few
	// microseconds between the two renames).
	if info, err := os.Lstat(liveLink); err == nil && info.Mode()&os.ModeSymlink == 0 {
		legacyDir := filepath.Join(filepath.Dir(releaseDir), time.Now().Add(-time.Second).Format("20060102-150405")+"-legacy")
		if err := os.Rename(liveLink, legacyDir); err != nil {
			return fmt.Errorf("move existing site directory: %w", err)
		}
	}

	// Create the new symlink next to the live one and rename it over the live one.
	// rename(2) replaces the old link atomically: every request sees either the old or the new site.
	tmpLink := liveLink + ".tmp"
	os.Remove(tmpLink)
	if err := os.Symlink(target, tmpLink); err != nil {
		return fmt.Errorf("create symlink: %w", err)
	}
	if err := os.Rename(tmpLink, liveLink); err != nil {
		os.Remove(tmpLink)
		return fmt.Errorf("swap symlink: %w", err)
	}
	return nil
}

// cleanupOldReleases deletes all but the newest keptReleases releases. The live release is never deleted.
func cleanupOldReleases(releasesDir, liveRelease string) error {
	entries, err := os.ReadDir(releasesDir)
	if err != nil {
		return err
	}

	var dirs []string
	for _, entry := range entries {
		if entry.IsDir() {
			dirs = append(dirs, entry.Name())
		}
	}
	// release names start with a timestamp, so they sort chronologically
	sort.Strings(dirs)

	for i := 0; i < len(dirs)-keptReleases; i++ {
		dir := filepath.Join(releasesDir, dirs[i])
		if dir == liveRelease {
			continue
		}
		if err := os.RemoveAll(dir); err != nil {
			return err
		}
	}
	return nil
}
