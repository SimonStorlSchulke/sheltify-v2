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
		badRequestResponse(w, r, "Invalid request payload")
		return zero, errorContentValidation
	}

	if content.GetTenantId() != "" && user.TenantID != content.GetTenantId() {
		forbiddenResponse(w, r, "Content gehört nicht zur Organisation des Benutzers")
		return zero, errorContentValidation
	}

	if errMessage := content.Validate(); errMessage != "" {
		badRequestResponse(w, r, errMessage)
		return zero, errorContentValidation
	}

	w.Header().Set("Content-Type", "application/json")
	content.SetTenantId(user.TenantID)
	return content, nil
}
