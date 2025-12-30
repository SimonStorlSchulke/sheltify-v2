package main

import (
	"sheltify-new-backend/handlers"

	"github.com/go-chi/chi/v5"
)

func initRoutes(r *chi.Mux) {
	r.Post("/admin/api/login", handlers.Login)

	rPublicApi := chi.NewRouter()
	publicRoutes(rPublicApi)
	r.Mount("/api/{tenant}", rPublicApi)

	rAdminApi := chi.NewRouter()
	rAdminApi.Use(handlers.AuthMiddleware)
	rAdminApi.Use(handlers.SetNeedsRebuild)
	adminRoutes(rAdminApi)
	r.Mount("/admin/api", rAdminApi)
}

func publicRoutes(r *chi.Mux) {
	r.Get("/animals/{id}", handlers.GetAnimalById)
	r.Get("/animals/filtered", handlers.GetFilteredAnimals)
	r.Get("/animals/by-article/{id}", handlers.GetAnimalsByArticleId)
	r.Get("/animals", handlers.GetAnimals)
	r.Get("/animals/home-found", handlers.GetAnimalsHomeFound)
	r.Get("/teammembers", handlers.GetTeamMembers)
	r.Get("/teammembers/{id}", handlers.GetTeamMemberById)

	r.Get("/media", handlers.GetMediaByIds)
	r.Get("/media-by-tags", handlers.GetMediaByTags)
	r.Get("/media-by-animals", handlers.GetMediaByAnimalIDs)
	r.Get("/tags", handlers.GetAllTags)
	r.Get("/article/{id}", handlers.GetArticle)
	r.Get("/configuration", handlers.GetTenantConfiguration)
	r.Get("/pages", handlers.GetPages)
	r.Get("/page-by-path", handlers.GetPageByPath)
	r.Get("/blogs", handlers.GetBlogEntries)
	r.Get("/blogs/{id}", handlers.GetBlogEntryById)

	r.Get("/animals/last-modified", handlers.GetLastModifiedAnimals)
}

func adminRoutes(r *chi.Mux) {
	r.Get("/configuration", handlers.GetTenantConfigurationCms)
	r.Post("/create-user", handlers.Register)

	r.Post("/animals", handlers.SaveAnimal)
	r.Patch("/animals", handlers.SaveAnimal)
	r.Delete("/animals", handlers.DeleteAnimalsByIds)

	r.Delete("/home-found-entries", handlers.DeleteHomeFoundEntriesByIds)

	r.Post("/blogs", handlers.SaveBlogEntry)
	r.Patch("/blogs", handlers.SaveBlogEntry)
	r.Delete("/blogs", handlers.DeleteBlogEntriesById)

	r.Post("/teammembers", handlers.SaveTeamMember)
	r.Patch("/teammembers", handlers.SaveTeamMember)
	r.Delete("/teammembers", handlers.DeleteTeamMember)

	r.Post("/media/scaled", handlers.UploadScaledWebps)
	r.Post("/files", handlers.UploadFiles)
	r.Post("/media", handlers.SaveMedia)
	r.Patch("/media", handlers.SaveMedia)
	r.Delete("/media/{id}", handlers.DeleteMedia) //Todo make into DeletebyIds like DeleteAnimalsByIds

	r.Post("/tags", handlers.CreateTag)
	r.Delete("/tags/{id}", handlers.DeleteTag) //Todo make into DeletebyIds like DeleteAnimalsByIds

	r.Get("/logout", handlers.Logout)
	r.Get("/relogin", handlers.Relogin)

	r.Post("/article", handlers.SaveArticle)
	r.Patch("/article", handlers.SaveArticle)

	r.Post("/pages", handlers.SavePage)
	r.Patch("/pages", handlers.SavePage)

	r.Delete("/pages", handlers.DeletePagesByIds)

	r.Patch("/configuration", handlers.SaveTenantConfiguration)

	r.Get("/trigger-build", handlers.TriggerAstroSiteBuild)
}
