package services

import (
	"net/http"
	"sheltify-new-backend/repository"
	"strconv"
)

func BuildAnimalsFilterFromQuery(r *http.Request) repository.AnimalsFilter {
	q := r.URL.Query()

	parseInt := func(s string) int {
		i, _ := strconv.Atoi(s)
		return i
	}

	parseFloat := func(s string) float64 {
		f, _ := strconv.ParseFloat(s, 64)
		return f
	}

	parseBool := func(s string) bool {
		b, _ := strconv.ParseBool(s)
		return b
	}

	return repository.AnimalsFilter{
		AnimalKind: q.Get("animalKind"),
		MaxNumber:  parseInt(q.Get("maxNumber")),
		AgeMin:     parseFloat(q.Get("ageMin")),
		AgeMax:     parseFloat(q.Get("ageMax")),
		SizeMin:    parseInt(q.Get("sizeMin")),
		SizeMax:    parseInt(q.Get("sizeMax")),
		Gender:     q.Get("gender"),
		InGermany:  parseBool(q.Get("inGermany")),
	}
}
