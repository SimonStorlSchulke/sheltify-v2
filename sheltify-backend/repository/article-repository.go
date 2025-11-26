package repository

import (
	"fmt"
	"sheltify-new-backend/shtypes"

	"gorm.io/gorm"
)

func GetArticleById(id int) (*shtypes.Article, error) {
	var article shtypes.Article
	if err := db.Where("id = ?", id).First(&article).Error; err != nil {
		return nil, err
	}
	return &article, nil
}

func GetArticleSectionByTypeAndId(sectionType string, sectionID int) (gorm.Model, error) {
	var section gorm.Model
	var err error

	switch sectionType {
	case "text":
		err = db.First(&section, sectionID).Error
	case "media":
		err = db.First(&section, sectionID).Error
	}

	fmt.Println(section)
	return section, err
}

func SaveArticleSectionByType(sectionType string, sectionID int) (gorm.Model, error) {
	var section gorm.Model
	var err error

	switch sectionType {
	case "text":
		err = db.First(&section, sectionID).Error
	case "media":
		err = db.First(&section, sectionID).Error
	}

	fmt.Println(section)
	return section, err
}

func SaveArticle(article *shtypes.Article) error {
	if err := db.Save(&article).Error; err != nil {
		return err
	}
	return nil
}
