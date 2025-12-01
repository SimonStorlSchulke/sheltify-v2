package main

import (
	"sheltify-new-backend/handlers"

	"github.com/go-chi/chi/v5"
)

func initRoutes(r *chi.Mux) {
	r.Post("/admin/api/register", handlers.Register)
	r.Post("/admin/api/login", handlers.Login)

	rPublicApi := chi.NewRouter()
	publicRoutes(rPublicApi)
	r.Mount("/api", rPublicApi)

	rAdminApi := chi.NewRouter()
	rAdminApi.Use(handlers.AuthMiddleware)
	adminRoutes(rAdminApi)
	r.Mount("/admin/api", rAdminApi)
}

func publicRoutes(r *chi.Mux) {
	r.Get("/{tenant}/animals/{id}", handlers.GetAnimalById)
	r.Get("/{tenant}/animals/by-article/{id}", handlers.GetAnimalsByArticleId)
	r.Get("/{tenant}/animals", handlers.GetTenantsAnimals)

	r.Get("/{tenant}/media", handlers.GetTenantsMediaByTags)
	r.Get("/{tenant}/tags", handlers.GetAllTags)
	r.Get("/{tenant}/article/{id}", handlers.GetArticle)
}

func adminRoutes(r *chi.Mux) {
	r.Post("/animals", handlers.SaveAnimal)
	r.Patch("/animals", handlers.SaveAnimal)
	r.Delete("/animals", handlers.DeleteAnimalsByIds)

	r.Post("/media/scaled", handlers.UploadScaledWebps)
	r.Patch("/media", handlers.SaveMedia)
	r.Delete("/media/{id}", handlers.DeleteMedia) //Todo make into DeletebyIds like DeleteAnimalsByIds

	r.Post("/tags", handlers.CreateTag)
	r.Delete("/tags/{id}", handlers.DeleteTag) //Todo make into DeletebyIds like DeleteAnimalsByIds

	r.Get("/logout", handlers.Logout)
	r.Get("/relogin", handlers.Relogin)

	r.Post("/article", handlers.SaveArticle)
	r.Patch("/article", handlers.SaveArticle)
}
