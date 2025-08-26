package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"sheltify-new-backend/services"
	"sheltify-new-backend/shtypes"
)

func validateRequestBody[K shtypes.Validatable](w http.ResponseWriter, r *http.Request) K {
	var content K
	var zero K

	user := services.UserFromContext(r)

	if user == nil || user.TenantID == nil || *user.TenantID == "" {
		http.Error(w, "users tenant could not be determined", http.StatusBadRequest)
		return zero
	}

	if err := json.NewDecoder(r.Body).Decode(&content); err != nil {
		http.Error(w, "Invalid request payload", http.StatusBadRequest)
		return zero
	}

	if errMessage := content.Validate(); errMessage != "" {
		http.Error(w, errMessage, http.StatusBadRequest)
		return zero
	}

	w.Header().Set("Content-Type", "application/json")
	fmt.Println("user tenant", user.TenantID)
	content.SetTenantId(*user.TenantID)
	return content
}

func parseRequestBody[K interface{}](w http.ResponseWriter, r *http.Request) *K {
	var content K

	if err := json.NewDecoder(r.Body).Decode(&content); err != nil {
		http.Error(w, "Invalid request payload", http.StatusBadRequest)
		return nil
	}

	w.Header().Set("Content-Type", "application/json")

	return &content
}
