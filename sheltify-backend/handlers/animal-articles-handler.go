package handlers

import (
	"net/http"
	"sheltify-new-backend/repository"

	"github.com/go-chi/chi/v5"
)

func GetAnimalArticleByName(w http.ResponseWriter, r *http.Request) {

	name := chi.URLParam(r, "name")

	if name == "" {
		http.Error(w, "name must be provided", http.StatusBadRequest)
		return
	}

	article, err := repository.GetAnimalArticleByAnimalName(name)

	if err != nil {
		http.NotFound(w, r)
		return
	}
	okResponse(w, article)
}
