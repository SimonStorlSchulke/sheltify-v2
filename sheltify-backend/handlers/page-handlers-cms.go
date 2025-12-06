package handlers

import (
	"net/http"
	"sheltify-new-backend/repository"
	"sheltify-new-backend/shtypes"
)

func SavePage(w http.ResponseWriter, r *http.Request) {
	page, err := validateRequestBody[*shtypes.Page](w, r)
	if err != nil {
		return
	}

	if repository.SavePage(page) != nil {
		internalServerErrorResponse(w, r, "Could not save page")
	} else {
		okResponse(w, page)
	}
}
