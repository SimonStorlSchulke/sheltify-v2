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
		internalServerErrorResponse(w, r, fmt.Sprintf("Could not save animal: %v", animal.ID))
	} else {
		logger.Saved(r, animal.ID)
		okResponse(w, animal)
	}
}

func DeleteAnimalsByIds(w http.ResponseWriter, r *http.Request) {
	DefaultDeleteByIds[*shtypes.Animal](w, r)
}
