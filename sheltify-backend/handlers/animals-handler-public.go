package handlers

import (
	"net/http"
	"sheltify-new-backend/repository"
	"sheltify-new-backend/services"
	"sheltify-new-backend/shtypes"
)

func GetAnimalById(w http.ResponseWriter, r *http.Request) {
	var animal shtypes.Animal
	DefaultGetById(w, r, &animal, "Portrait")
}

func GetFilteredAnimals(w http.ResponseWriter, r *http.Request) {
	tenant, err := tenantFromParameter(w, r)
	if err != nil {
		return
	}

	animalsFilter := services.BuildAnimalsFilterFromQuery(r)
	animals, err := repository.GetFilteredAnimals(animalsFilter, tenant)

	if err != nil {
		http.NotFound(w, r)
		return
	}
	okResponse(w, animals)
}

func GetAnimalsByArticleId(w http.ResponseWriter, r *http.Request) {
	id, err := idFromParameter(w, r)
	if err != nil {
		return
	}
	var animal shtypes.Animal
	DefaultGetByField(w, r, "article_id", id, &animal, "Portrait")
}

func GetAnimals(w http.ResponseWriter, r *http.Request) {
	animals := []*shtypes.Animal{}
	DefaultGetAll(w, r, &animals, "Portrait")
}
