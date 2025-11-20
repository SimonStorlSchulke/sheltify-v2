package repository

import (
	"sheltify-new-backend/shtypes"
)

func GetAnimal(id int) (*shtypes.Animal, error) {
	var animal shtypes.Animal
	// populate AnimalArticle like this:
	if err := db.Preload("Portrait").First(&animal, id).Error; err != nil {
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
