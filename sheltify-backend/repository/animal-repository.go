package repository

import (
	"fmt"
	"math"
	"sheltify-new-backend/shtypes"
	"strings"
	"time"
)

type AnimalsFilter struct {
	AnimalKind string
	MaxNumber  int
	AgeMin     float64
	AgeMax     float64
	SizeMin    int
	SizeMax    int
	Gender     string
	InGermany  bool
	Names      string //separated by "-"
}

func GetFilteredAnimals(filter AnimalsFilter, tenant string) (*[]shtypes.Animal, error) {
	var animals []shtypes.Animal

	query := db.Model(&shtypes.Animal{})

	query = query.Where("tenant_id = ?", tenant)

	if filter.Names != "" {
		names := strings.Split(filter.Names, "-")
		query.Where("name IN ?", names)
	}

	if filter.AnimalKind != "" {
		query = query.Where("type = ?", filter.AnimalKind)
	}

	if filter.Gender != "" {
		query = query.Where("gender = ?", filter.Gender)
	}

	if filter.SizeMin > 0 {
		query = query.Where("shoulder_height_cm >= ?", filter.SizeMin)
	}
	if filter.SizeMax > 0 {
		query = query.Where("shoulder_height_cm <= ?", filter.SizeMax)
	}

	now := time.Now()

	if filter.AgeMin > 0 {
		years := int(math.Floor(filter.AgeMin))
		months := int(math.Round((filter.AgeMin - float64(years)) * 12))
		minBirthdate := now.AddDate(-years, -months, 0)
		fmt.Println("minBirthdate:", minBirthdate)
		query = query.Where("birthday <= ?", minBirthdate)
	}

	if filter.AgeMax > 0 {
		years := int(math.Floor(filter.AgeMax))
		months := int(math.Round((filter.AgeMax - float64(years)) * 12))
		maxBirthdate := now.AddDate(-years, -months, 0)
		fmt.Println("minBirthdate:", maxBirthdate)
		query = query.Where("birthday >= ?", maxBirthdate)
	}

	if filter.InGermany {
		query = query.Where("status = ?", "germany")
	}

	if filter.MaxNumber > 0 {
		query = query.Limit(filter.MaxNumber)
	}

	query = query.Preload("Portrait")

	if err := query.Find(&animals).Error; err != nil {
		return nil, err
	}

	return &animals, nil
}

func SaveAnimal(animal *shtypes.Animal) error {
	if err := db.Save(&animal).Error; err != nil {
		return err
	}
	return nil
}

func SaveHomeFoundEntries(entries *[]shtypes.HomeFoundEntry) error {
	if len(*entries) == 0 {
		return nil
	}
	if err := db.Save(&entries).Error; err != nil {
		return err
	}
	return nil
}

func CreateAnimal(animal *shtypes.Animal) (string, error) {
	if err := db.Create(&animal).Error; err != nil {
		return "", err
	}
	return animal.ID, nil
}

func DeleteAnimalsByIds(ids []int) error {
	return db.Unscoped().Delete(&shtypes.Animal{}, ids).Error
}
