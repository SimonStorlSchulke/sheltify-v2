package repository

import "sheltify-new-backend/shtypes"

func SaveBlogEntry(page *shtypes.BlogEntry) error {
	if err := db.Save(&page).Error; err != nil {
		return err
	}

	return nil
}
