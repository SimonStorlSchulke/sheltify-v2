package handlers

import (
	"fmt"
	"net/http"
	"sheltify-new-backend/repository"
)

func GetAnimalById(w http.ResponseWriter, r *http.Request) {
	id, err := idFromParameter(w, r)
	if err != nil {
		return
	}

	animal, err := repository.GetAnimal(id)

	if err != nil {
		http.NotFound(w, r)
		return
	}
	okResponse(w, animal)
}

func GetTenantsAnimalById(w http.ResponseWriter, r *http.Request) {
	id, err := idFromParameter(w, r)
	if err != nil {
		badRequestResponse(w, "Invalid animal ID")
		return
	}
	tenant, err := tenantFromParameter(w, r)
	if err != nil {
		badRequestResponse(w, "Invalid tenant")
		return
	}

	animal, err := repository.GetTenantsAnimal(id, tenant)

	if err != nil {
		http.NotFound(w, r)
		return
	}
	okResponse(w, animal)
}

func GetAnimals(w http.ResponseWriter, r *http.Request) {
	animal, err := repository.GetAnimals()

	if err != nil {
		http.NotFound(w, r)
		return
	}
	fmt.Println(animal)
	okResponse(w, animal)
}

func GetTenantsAnimals(w http.ResponseWriter, r *http.Request) {
	tenant, err := tenantFromParameter(w, r)
	if err != nil {
		return
	}
	animal, err := repository.GetTenantsAnimals(tenant)
	if err != nil {
		http.NotFound(w, r)
		return
	}
	okResponse(w, animal)
}
