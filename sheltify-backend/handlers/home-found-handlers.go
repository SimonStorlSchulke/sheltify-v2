package handlers

import (
	"net/http"
	"sheltify-new-backend/repository"
	"sheltify-new-backend/shtypes"
)

func DeleteHomeFoundEntriesByIds(w http.ResponseWriter, r *http.Request) {
	DefaultDeleteByIds[*shtypes.HomeFoundEntry](w, r, false)
}

func SaveHomeFoundEntry(w http.ResponseWriter, r *http.Request) {
	homeFoundEntry, err := validateRequestBody[*shtypes.HomeFoundEntry](w, r)
	if err != nil {
		return
	}

	if repository.SaveHomeFoundEntry(homeFoundEntry) != nil {
		internalServerErrorResponse(w, r, "Could not save HomeFoundEntry")
	} else {
		okResponse(w, homeFoundEntry)
	}
}

func GetHomeFoundEntries(w http.ResponseWriter, r *http.Request) {
	entries := []*shtypes.HomeFoundEntry{}
	DefaultGetAll(w, r, &entries)
}

func GetHomeFoundEntryById(w http.ResponseWriter, r *http.Request) {
	var entry *shtypes.HomeFoundEntry
	DefaultGetById(w, r, &entry)
}
