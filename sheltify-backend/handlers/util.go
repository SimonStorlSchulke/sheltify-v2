package handlers

import (
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"sheltify-new-backend/logger"
	"sheltify-new-backend/repository"
	"sheltify-new-backend/services"
	"sheltify-new-backend/shtypes"
	"strconv"
	"strings"

	"github.com/go-chi/chi/v5"
)

func idFromParameter(w http.ResponseWriter, r *http.Request) (string, error) {
	id := chi.URLParam(r, "id")

	if id == "nil" {
		badRequestResponse(w, r, "id must be provided")
		return "", errors.New("id not provided")
	}
	return id, nil
}

// returns list of ids from comma separated queryparameter (?ids=1,2,3,4)
func idsFromQuery(w http.ResponseWriter, r *http.Request) ([]string, error) {
	idsStringParam := r.URL.Query().Get("ids")

	idStrings := strings.Split(idsStringParam, ",")

	ids := make([]string, len(idStrings))
	for i, id := range idStrings {
		ids[i] = id
	}
	return ids, nil
}

func tenantFromParameter(w http.ResponseWriter, r *http.Request) (string, error) {
	tenant := chi.URLParam(r, "tenant")

	if tenant == "" {
		badRequestResponse(w, r, "tenant must be provided (api/{tenant Identifier}/...)")
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

func badRequestResponse(w http.ResponseWriter, r *http.Request, why string) {
	logger.Warn(r, why)
	http.Error(w, why, http.StatusBadRequest)
}

func forbiddenResponse(w http.ResponseWriter, r *http.Request, why string) {
	logger.Warn(r, why)
	http.Error(w, why, http.StatusForbidden)
}

func internalServerErrorResponse(w http.ResponseWriter, r *http.Request, why string) {
	logger.Error(r, why)
	http.Error(w, why, http.StatusInternalServerError)
}

func jsonResponse(w http.ResponseWriter, statusCode int, content any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)
	json.NewEncoder(w).Encode(content)
}

func DefaultGetAll[T shtypes.Validatable](w http.ResponseWriter, r *http.Request, out *[]T, preloads ...string) {
	tenant, err := tenantFromParameter(w, r)
	if err != nil {
		return
	}
	if err := repository.DefaultGetAll(tenant, out, preloads...); err != nil {
		http.NotFound(w, r)
		return
	}
	okResponse(w, out)
}

func DefaultGetById[T any](w http.ResponseWriter, r *http.Request, out *T, preloads ...string) {
	tenant, err := tenantFromParameter(w, r)
	if err != nil {
		return
	}
	id, err := idFromParameter(w, r)
	if err != nil {
		return
	}
	if err := repository.DefaultGetByID(id, tenant, out, preloads...); err != nil {
		http.NotFound(w, r)
		return
	}
	okResponse(w, out)
}

func DefaultGetByIds[T any](w http.ResponseWriter, r *http.Request, out *[]T, preloads ...string) {
	tenant, err := tenantFromParameter(w, r)
	if err != nil {
		return
	}
	ids, err := idsFromQuery(w, r)
	if err != nil {
		return
	}
	if err := repository.DefaultGetByIDs(ids, tenant, out, preloads...); err != nil {
		http.NotFound(w, r)
		return
	}
	okResponse(w, out)
}

func DefaultGetLastModified[T any](w http.ResponseWriter, r *http.Request, out *[]T, preloads ...string) {
	tenant, err := tenantFromParameter(w, r)
	if err != nil {
		return
	}

	amount := r.URL.Query().Get("amount")
	if amount == "" {
		amount = "10"
	}

	amountInt, err := strconv.Atoi(amount)
	if err != nil {
		badRequestResponse(w, r, "amount must be a number")
		return
	}

	if err := repository.DefaultGetLastModified(tenant, amountInt, out, preloads...); err != nil {
		http.NotFound(w, r)
	}
	okResponse(w, out)
}

func DefaultGetByField[T any](w http.ResponseWriter, r *http.Request, field string, value any, out *T, preloads ...string) {
	tenant, err := tenantFromParameter(w, r)
	if err != nil {
		return
	}
	if err := repository.DefaultGetByField(field, value, tenant, out, preloads...); err != nil {
		http.NotFound(w, r)
		return
	}
	okResponse(w, out)
}

func DefaultDeleteByIds[T shtypes.Validatable](w http.ResponseWriter, r *http.Request, deleteOrphanedArticles bool) []string {
	user := services.UserFromRequest(r)
	if user.TenantID == "" {
		return []string{}
	}
	ids, err := idsFromQuery(w, r)
	if err != nil {
		return []string{}
	}

	err = repository.DefaultDeleteByIDS[T](ids, user.TenantID)

	if deleteOrphanedArticles {
		repository.DeleteOrphanedArticles(user.TenantID)
	}

	if err == nil {
		logger.Deleted(r, ids)
		emptyOkResponse(w)
		return ids
	} else {
		internalServerErrorResponse(w, r, fmt.Sprintf("Failed deleting by ids: %v", ids))
	}
	return []string{}
}
