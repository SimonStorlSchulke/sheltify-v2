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
		internalServerErrorResponse(w, "Could not update media")
	} else {
		okResponse(w, animal)
	}
}

func DeleteAnimalsByIds(w http.ResponseWriter, r *http.Request) {
	ids, err := idsFromQuery(w, r)
	if err != nil {
		return
	}

	failedForIds := make([]int, 0)
	for _, id := range ids {
		err = repository.DeleteAnimal(id)
		if err != nil {
			failedForIds = append(failedForIds, id)
		}
	}

	if len(failedForIds) == 0 {
		emptyOkResponse(w)
	} else {
		internalServerErrorResponse(w, fmt.Sprint("Failed deleting ids", failedForIds))
	}
}

func SetAnimalPortrait(w http.ResponseWriter, r *http.Request) {
	animalId, err := idFromParameter(w, r)
	if err != nil {
		return
	}

	mediaId := r.URL.Query().Get("mediaId")
	if mediaId == "" {
		badRequestResponse(w, "mediaId must be provided")
		return
	}

	err = services.SetAnimalPortrait(animalId, mediaId)
	if err != nil {
		internalServerErrorResponse(w, "Failed to set animal portrait")
		return
	}

	okResponse(w, "Animal portrait updated successfully")
}
