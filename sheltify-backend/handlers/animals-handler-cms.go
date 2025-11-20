package handlers

import (
	"fmt"
	"net/http"
	"sheltify-new-backend/logger"
	"sheltify-new-backend/repository"
	"sheltify-new-backend/shtypes"
)

func SaveAnimal(w http.ResponseWriter, r *http.Request) {
	animal, err := validateRequestBody[*shtypes.Animal](w, r)
	if err != nil {
		return
	}

	if animal.Portrait != nil {
		animal.PortraitID = &animal.Portrait.ID //TODO.. ugly
	}

	if repository.SaveAnimal(animal) != nil {
		internalServerErrorResponse(w, r, "Could not save animal")
	} else {
		logger.Saved(r, "Animal", fmt.Sprintf("%v", animal.ID))
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
		logger.Deleted(r, "Animals", logger.Ints(ids))
		emptyOkResponse(w)
	} else {
		internalServerErrorResponse(w, r, fmt.Sprint("Failed deleting animals by ids:", ids))
	}
}
