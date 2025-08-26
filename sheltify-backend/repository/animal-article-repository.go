package repository

import (
	"sheltify-new-backend/shtypes"
)

func CreateAnimalArticle(animal *shtypes.AnimalArticle) {
	db.Create(&animal)
}

func DeleteAnimalArticle(id int) {
	db.Delete(&shtypes.AnimalArticle{}, id)
}

func GetAnimalArticle(id int) (*shtypes.AnimalArticle, error) {
	var animal shtypes.AnimalArticle
	// populate AnimalArticle like this:
	//if err := db.Preload("AnimalArticle").First(&animal, id).Error; err != nil {
	if err := db.First(&animal, id).Error; err != nil {
		return nil, err
	}
	return &animal, nil
}

func GetAnimalArticleByAnimalName(name string) (*shtypes.AnimalArticle, error) {
	var article shtypes.AnimalArticle

	err := db.Preload("Animals").
		Joins("JOIN animals ON animals.animal_article_id = animal_articles.id").
		Where("LOWER(animals.name) = LOWER(?)", name).
		First(&article).Error

	if err != nil {
		return nil, err
	}
	return &article, nil
}

func GetAnimalArticleByAnimalId(id int) (*shtypes.AnimalArticle, error) {
	var animal shtypes.AnimalArticle
	// populate AnimalArticle like this:
	//if err := db.Preload("AnimalArticle").First(&animal, id).Error; err != nil {
	if err := db.First(&animal, id).Error; err != nil {
		return nil, err
	}
	return &animal, nil
}
