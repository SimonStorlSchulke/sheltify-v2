package handlers

import (
	"net/http"
	"sheltify-new-backend/repository"
	"sheltify-new-backend/shtypes"
)

func GetTenantConfiguration(w http.ResponseWriter, r *http.Request) {
	tenant, err := tenantFromParameter(w, r)
	if err != nil {
		return
	}
	config, err := repository.GetConfigByTenantId(tenant)
	if err != nil {
		http.NotFound(w, r)
		return
	}
	okResponse(w, config)
}

func SaveTenantConfiguration(w http.ResponseWriter, r *http.Request) {
	config, err := validateRequestBody[*shtypes.TenantConfiguration](w, r)
	if err != nil {
		return
	}

	if repository.SaveTenantConfiguration(config) != nil {
		internalServerErrorResponse(w, r, "Could not save tenant configuration")
	} else {
		okResponse(w, config)
	}
}
