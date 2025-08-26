package handlers

import (
	"encoding/json"
	"errors"
	"net/http"
	"strconv"
	"strings"

	"github.com/go-chi/chi/v5"
)

func idFromParameter(w http.ResponseWriter, r *http.Request) (int, error) {
	id, err := strconv.Atoi(chi.URLParam(r, "id"))

	if err != nil {
		http.Error(w, "id must be an integer", http.StatusBadRequest)
		return -1, err
	}
	return id, nil
}

// returns list of ids from comma separated queryparameter (?ids=1,2,3,4)
func idsFromQuery(w http.ResponseWriter, r *http.Request) ([]int, error) {
	idsStringParam := r.URL.Query().Get("ids")

	idStrings := strings.Split(idsStringParam, ",")

	ids := make([]int, len(idStrings))
	for i, idString := range idStrings {
		id, err := strconv.Atoi(idString)
		if err != nil {
			http.Error(w, "ids queryparam needs to be a comma-separated string of ids (eg. /api/animals?ids=1,2,3)", http.StatusBadRequest)
			return nil, err
		}
		ids[i] = id
	}
	return ids, nil
}

func tenantFromParameter(w http.ResponseWriter, r *http.Request) (string, error) {
	tenant := chi.URLParam(r, "tenant")

	if tenant == "" {
		http.Error(w, "tenant must be provided (api/{tenant Identifier}/...)", http.StatusBadRequest)
		return "", errors.New("tenant not provided")
	}
	return tenant, nil
}

func okResponse(w http.ResponseWriter, content any) {
	jsonResponse(w, http.StatusOK, content)
}

func emptyOkResponse(w http.ResponseWriter) {
	w.WriteHeader(http.StatusOK)
}

func createdResponse(w http.ResponseWriter, content any) {
	jsonResponse(w, http.StatusCreated, content)
}

func badRequestResponse(w http.ResponseWriter, why string) {
	http.Error(w, why, http.StatusBadRequest)
}

func forbiddenResponse(w http.ResponseWriter, why string) {
	http.Error(w, why, http.StatusForbidden)
}

func internalServerErrorResponse(w http.ResponseWriter, why string) {
	http.Error(w, why, http.StatusInternalServerError)
}

func jsonResponse(w http.ResponseWriter, statusCode int, content any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)
	json.NewEncoder(w).Encode(content)
}
