package handlers

import (
	"database/sql"
	"net/http"
	"os"
	"os/exec"
	"sheltify-backend/repository"
	"sheltify-backend/services"
	"time"
)

func TriggerAstroSiteBuild(w http.ResponseWriter, r *http.Request) {
	user := services.UserFromRequest(r)

	cmd := exec.Command("npm", "run", "build:"+user.TenantID)

	cmd.Stdout = w
	cmd.Stderr = os.Stderr
	cmd.Stdin = os.Stdin
	cmd.Dir = "../clients"

	if err := cmd.Run(); err != nil {
		internalServerErrorResponse(w, r, "Seite konnte nicht gebaut werden. Bitte Administrator melden. Fehler: "+err.Error())
		return
	}

	// Build the search index for the freshly built site.
	pagefindCmd := exec.Command("npx", "pagefind", "--site", "/var/www/sheltify/client-"+user.TenantID) //todo: ugly hardcoded path...
	pagefindCmd.Stdout = w
	pagefindCmd.Stderr = os.Stderr
	pagefindCmd.Dir = "../clients" // pagefind is a dependency of the clients package
	pagefindErr := pagefindCmd.Run()

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

	if pagefindErr != nil {
		internalServerErrorResponse(w, r, "Seite wurde gebaut, Suchindex konnte aber nicht erstellt werden. Bitte Administrator melden. Fehler: "+pagefindErr.Error())
		return
	}

	emptyOkResponse(w)
}
