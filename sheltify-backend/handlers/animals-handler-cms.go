package handlers

import (
	"fmt"
	"net/http"
	"sheltify-new-backend/logger"
	"sheltify-new-backend/repository"
	"sheltify-new-backend/shtypes"
)

func SaveAnimal(w http.ResponseWriter, r *http.Request) {
	animal, err := validatePublishable[*shtypes.Animal](w, r)
	if err != nil {
		return
	}

	if animal.Portrait != nil {
		animal.PortraitID = &animal.Portrait.ID //TODO.. ugly
	}

	for i, _ := range animal.HomeFoundEntries {
		animal.HomeFoundEntries[i].AnimalID = animal.ID
		animal.HomeFoundEntries[i].TenantID = animal.TenantID
	}

	if repository.SaveAnimal(animal) != nil {
		internalServerErrorResponse(w, r, fmt.Sprintf("Could not save animal: %v", animal.ID))
	} else {
		logger.Saved(r, animal.ID)
	}

	if repository.SaveHomeFoundEntries(&animal.HomeFoundEntries) != nil {
		internalServerErrorResponse(w, r, fmt.Sprintf("Could not save HomeFoundEntries: %v", animal.ID))
	} else {
		logger.Saved(r, animal.ID)
		okResponse(w, animal)
	}
}

func DeleteAnimalsByIds(w http.ResponseWriter, r *http.Request) {
	DefaultDeleteByIds[*shtypes.Animal](w, r, true)
}

func DeleteHomeFoundEntriesByIds(w http.ResponseWriter, r *http.Request) {
	DefaultDeleteByIds[*shtypes.HomeFoundEntry](w, r, false)
}
