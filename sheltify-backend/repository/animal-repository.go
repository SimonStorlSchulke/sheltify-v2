package repository

import (
	"fmt"
	"math"
	"sheltify-new-backend/shtypes"
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
}

func GetFilteredAnimals(filter AnimalsFilter, tenant string) (*[]shtypes.Animal, error) {
	var animals []shtypes.Animal

	query := db.Model(&shtypes.Animal{})

	query = query.Where("tenant_id = ?", tenant)

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

func GetAnimal(id int) (*shtypes.Animal, error) {
	var animal shtypes.Animal
	// populate AnimalArticle like this:
	if err := db.Preload("Portrait").First(&animal, id).Error; err != nil {
		return nil, err
	}
	return &animal, nil
}

func GetAnimalsByArticleId(id int) (*shtypes.Animal, error) {
	var animal shtypes.Animal
	if err := db.Preload("Portrait").Where("article_id = ?", id).First(&animal).Error; err != nil {
		return nil, err
	}
	return &animal, nil
}

func GetTenantsAnimal(id int, tenant string) (*shtypes.Animal, error) {
	var animal shtypes.Animal
	if err := db.Where("tenant_id = ?", tenant).First(&animal, id).Error; err != nil {
		return nil, err
	}
	return &animal, nil
}

func GetAnimals() (*[]shtypes.Animal, error) {
	var animals []shtypes.Animal

	if err := db.Preload("Portrait").Find(&animals).Error; err != nil {
		return nil, err
	}
	return &animals, nil
}

func GetTenantsAnimals(tenant string) (*[]shtypes.Animal, error) {
	var animals []shtypes.Animal
	if err := db.Preload("Portrait").Where("tenant_id = ?", tenant).Find(&animals).Error; err != nil {
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

func CreateAnimal(animal *shtypes.Animal) (uint, error) {
	if err := db.Create(&animal).Error; err != nil {
		return 0, err
	}
	return animal.ID, nil
}

func DeleteAnimalsByIds(ids []int) error {
	return db.Unscoped().Delete(&shtypes.Animal{}, ids).Error
}
