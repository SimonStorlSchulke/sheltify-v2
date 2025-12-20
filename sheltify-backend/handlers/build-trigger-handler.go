package handlers

import (
	"database/sql"
	"net/http"
	"os"
	"os/exec"
	"sheltify-new-backend/repository"
	"sheltify-new-backend/services"
	"time"
)

func TriggerAstroSiteBuild(w http.ResponseWriter, r *http.Request) {
	user := services.UserFromRequest(r)

	cmd := exec.Command("npm", "run", "build:"+user.TenantID)

	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	cmd.Stdin = os.Stdin
	cmd.Dir = "../clients"

	if err := cmd.Run(); err != nil {
		internalServerErrorResponse(w, r, "Seite konnte nicht gebaut werden. Bitte Simon melden. Fehler: "+err.Error())
		return
	}

	tenantonfig, err := repository.GetConfigByTenantId(user.TenantID)

	if err == nil {
		tenantonfig.LastBuild = sql.NullTime{
			Time:  time.Now(),
			Valid: true,
		}
		err = repository.SaveTenantConfiguration(tenantonfig)
	}

	if err != nil {
		internalServerErrorResponse(w, r, "Seite wurde gebaut, Tenantconfiguration knnte aber nicht gespeichert werden")
		return
	}

	emptyOkResponse(w)
}
