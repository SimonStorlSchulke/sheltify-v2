package repository

import "sheltify-new-backend/shtypes"

func SaveArticle(article *shtypes.Article) error {
	if err := db.Save(&article).Error; err != nil {
		return err
	}
	return nil
}
