package repository

import "sheltify-new-backend/shtypes"

func SaveBlogEntry(page *shtypes.BlogEntry) error {
	if err := db.Save(&page).Error; err != nil {
		return err
	}

	return nil
}

func GetBlogEntryByName(name string) (*shtypes.BlogEntry, error) {
	var blogEntry shtypes.BlogEntry
	if err := db.Where("title = ?", name).Preload("Article").First(&blogEntry).Error; err != nil {
		return nil, err
	}
	return &blogEntry, nil
}
