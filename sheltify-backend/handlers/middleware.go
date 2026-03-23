package handlers

import (
	"context"
	"net/http"
	"os"
	"sheltify-new-backend/logger"
	"sheltify-new-backend/repository"
	"sheltify-new-backend/services"
	"sheltify-new-backend/shtypes"
)

func AuthMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

		expectedBypassBearer := os.Getenv("API_BEARER")
		sentBypassBearer := r.Header.Get("Authorization")

		bypassAuthEnabled := expectedBypassBearer != ""
		tryBypassAuth := sentBypassBearer != "" && sentBypassBearer != "Bearer"

		var user *shtypes.User

		if tryBypassAuth && bypassAuthEnabled {
			if sentBypassBearer == "Bearer "+expectedBypassBearer {
				logger.Info(r, "Bypassing authentication with valid bearer token")
				ctx := context.WithValue(r.Context(), "user", &shtypes.BypassAuthUser)
				next.ServeHTTP(w, r.WithContext(ctx))
				return
			} else {
				http.Error(w, "Invalid Bearer Token", http.StatusForbidden)
				return;
			}
		}

		user, err := services.Authorize(r)
		
		if err != nil {
			http.Error(w, "Authorization Failed", http.StatusForbidden)
			return
		}

		ctx := context.WithValue(r.Context(), "user", user)

		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

func SetNeedsRebuild(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.RequestURI == "/admin/api/trigger-build" {
			next.ServeHTTP(w, r)
			return
		}
		switch r.Method {
		case http.MethodPost, http.MethodPatch, http.MethodDelete:
			user := services.UserFromRequest(r)

			if(user == nil) {
				logger.Error(r, "No user found in context for SetNeedsRebuild middleware")
				return
			}

			config, err := repository.GetConfigByTenantId(user.TenantID)
			if err != nil {
				logger.Error(r, "Could not find tenant configuration for tenant"+user.TenantID)
				return
			}

			config.NeedsRebuild = true
			repository.SaveTenantConfiguration(config)
		}

		next.ServeHTTP(w, r)
	})
}
