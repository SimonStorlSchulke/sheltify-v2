package handlers

import (
	"fmt"
	"net/http"
	"sheltify-new-backend/repository"
	"sheltify-new-backend/services"
	"sheltify-new-backend/shtypes"
)

func CreateAnimal(w http.ResponseWriter, r *http.Request) {

	animal := validateRequestBody[*shtypes.Animal](w, r)
	animal.TenantID = *services.UserFromContext(r).TenantID

	if repository.CreateAnimal(animal) != nil {
		internalServerErrorResponse(w, "Could not create animal")
	} else {
		createdResponse(w, animal)
	}
}

func SaveAnimal(w http.ResponseWriter, r *http.Request) {
	animal := validateRequestBody[*shtypes.Animal](w, r)
	if animal.Portrait != nil {
		animal.PortraitID = &animal.Portrait.ID //TODO.. ugly
	}
	if animal == nil {
		return
	}

	if repository.SaveAnimal(animal) != nil {
		internalServerErrorResponse(w, "Could not save animal")
	} else {
		okResponse(w, animal)
	}
}

func DeleteAnimalsByIds(w http.ResponseWriter, r *http.Request) {
	ids, err := idsFromQuery(w, r)
	if err != nil {
		return
	}

	err = repository.DeleteAnimalsByIds(ids)

	if err == nil {
		emptyOkResponse(w)
	} else {
		internalServerErrorResponse(w, fmt.Sprint("Failed deleting animals by ids:", ids))
	}
}
