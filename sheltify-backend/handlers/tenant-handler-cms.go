package handlers

import (
	"net/http"
	"sheltify-backend/repository"
	"sheltify-backend/services"
	"sheltify-backend/shtypes"
)

func CreateTenant(w http.ResponseWriter, r *http.Request) {
	ID := r.FormValue("ID")
	Name := r.FormValue("Name")
	SiteUrl := r.FormValue("SiteUrl")

	if ID == "" || Name == "" || SiteUrl == "" {
		badRequestResponse(w, r, "ID, Name and SiteUrl are required")
	}

	_, err := repository.CreateTenant(ID)
	if err != nil {
		internalServerErrorResponse(w, r, "Could not create tenant")
	}

	tenantConfig := &shtypes.TenantConfiguration{
		TenantID: ID,
		Name:     Name,
		SiteUrl:  SiteUrl,
	}

	err = repository.SaveTenantConfiguration(tenantConfig)

	if err != nil {
		internalServerErrorResponse(w, r, "Could not create tenant configuration")
	}

	createdResponse(w, tenantConfig)
}

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

func GetTenantConfigurationCms(w http.ResponseWriter, r *http.Request) {
	user := services.UserFromRequest(r)
	if user == nil {
		return
	}
	config, err := repository.GetConfigByTenantId(user.TenantID)
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

	if config.LogoHeader != nil {
		config.LogoHeaderID = &config.LogoHeader.ID //TODO.. ugly
	}

	if repository.SaveTenantConfiguration(config) != nil {
		internalServerErrorResponse(w, r, "Could not save tenant configuration")
	} else {
		okResponse(w, config)
	}
}
