package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"sheltify-new-backend/services"
	"sheltify-new-backend/shtypes"
)

var errorContentValidation = fmt.Errorf("content validation error")

func validateRequestBody[K shtypes.Validatable](w http.ResponseWriter, r *http.Request) (K, error) {
	var content K
	var zero K

	user := services.UserFromRequest(r)

	if user == nil || user.TenantID == "" {
		forbiddenResponse(w, r, "users tenant could not be determined")
		return zero, errorContentValidation
	}

	if err := json.NewDecoder(r.Body).Decode(&content); err != nil {
		badRequestResponse(w, r, "Invalid request payload: "+err.Error())
		return zero, errorContentValidation
	}

	if errMessage := content.Validate(); errMessage != "" {
		badRequestResponse(w, r, errMessage)
		return zero, errorContentValidation
	}

	w.Header().Set("Content-Type", "application/json")
	content.SetLastModifiedBy(user.Name)
	content.SetTenantId(user.TenantID)
	return content, nil
}

func parseRequestBody[K any](w http.ResponseWriter, r *http.Request) (K, error) {
	var content K
	var zero K

	if err := json.NewDecoder(r.Body).Decode(&content); err != nil {
		badRequestResponse(w, r, "Invalid request payload: "+err.Error())
		return zero, errorContentValidation
	}

	w.Header().Set("Content-Type", "application/json")
	return content, nil
}

func validatePublishable[K shtypes.ValidatableForPublishing](w http.ResponseWriter, r *http.Request) (K, error) {
	var content K
	var zero K

	user := services.UserFromRequest(r)

	if user == nil || user.TenantID == "" {
		forbiddenResponse(w, r, "users tenant could not be determined")
		return zero, errorContentValidation
	}

	if err := json.NewDecoder(r.Body).Decode(&content); err != nil {
		badRequestResponse(w, r, "Invalid request payload: "+err.Error())
		return zero, errorContentValidation
	}

	pa := content.GetPubhlishedAt()

	if pa.Valid {
		if errMessage := content.ValidateForPublishing(); errMessage != "" {
			badRequestResponse(w, r, errMessage)
			return zero, errorContentValidation
		}
	} else {
		if errMessage := content.Validate(); errMessage != "" {
			badRequestResponse(w, r, errMessage)
			return zero, errorContentValidation
		}
	}

	w.Header().Set("Content-Type", "application/json")
	content.SetLastModifiedBy(user.Name)
	content.SetTenantId(user.TenantID)
	return content, nil
}
