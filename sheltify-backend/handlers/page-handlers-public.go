package handlers

import (
	"net/http"
	"sheltify-new-backend/repository"
	"sheltify-new-backend/shtypes"
)

func GetPages(w http.ResponseWriter, r *http.Request) {
	var pages []*shtypes.Page
	DefaultGetAll(w, r, &pages)
}

func GetPageByPath(w http.ResponseWriter, r *http.Request) {
	tenant, err := tenantFromParameter(w, r)
	if err != nil {
		return
	}
	path := r.URL.Query().Get("path")

	page, err := repository.GetPageByPath(tenant, path)

	if err != nil {
		http.NotFound(w, r)
		return
	}
	okResponse(w, page)
}
