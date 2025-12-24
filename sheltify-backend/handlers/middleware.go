package handlers

import (
	"context"
	"net/http"
	"os"
	"sheltify-new-backend/logger"
	"sheltify-new-backend/repository"
	"sheltify-new-backend/services"
)

func AuthMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

		bypassAuth := os.Getenv("API_BEARER") != r.Header.Get("Authorization")

		user, err := services.Authorize(r)

		if err != nil && !bypassAuth {
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
