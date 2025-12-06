package repository

import "sheltify-new-backend/shtypes"

func GetPageByPath(tenantId string, path string) (*shtypes.Page, error) {
	var page shtypes.Page
	if err := db.Where("tenant_id = ? AND path = ?", tenantId, path).First(&page).Error; err != nil {
		return nil, err
	}
	return &page, nil
}

func SavePage(page *shtypes.Page) error {
	if err := db.Save(&page).Error; err != nil {
		return err
	}
	/*
		if page.Article.ID != nil {
			page.ArticleID = &page.Article.ID
		} */

	return nil
}
