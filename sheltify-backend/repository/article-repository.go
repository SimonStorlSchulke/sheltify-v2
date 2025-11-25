package repository

import "sheltify-new-backend/shtypes"

func GetArticleById(id int) (*shtypes.Article, error) {
	var article shtypes.Article
	if err := db.Where("id = ?", id).First(&article).Error; err != nil {
		return nil, err
	}
	return &article, nil
}

func SaveArticle(article *shtypes.Article) error {
	if err := db.Save(&article).Error; err != nil {
		return err
	}
	return nil
}
