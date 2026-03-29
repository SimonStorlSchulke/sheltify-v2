package repository

import "sheltify-new-backend/shtypes"

func SaveBlogEntry(page *shtypes.BlogEntry) error {
	if err := db.Save(&page).Error; err != nil {
		return err
	}

	return nil
}

func GetBlogEntryByName(tenant string, name string) (*shtypes.BlogEntry, error) {
	var blogEntry shtypes.BlogEntry
	if err := db.Where("tenant_id = ?", tenant).Where("title = ?", name).Preload("Article").First(&blogEntry).Error; err != nil {
		return nil, err
	}
	return &blogEntry, nil
}

func GetByPaginationBlogEntries(tenant string, pageSize int, pageindex int, category string) (*[]shtypes.BlogEntry, error) {
	var blogEntries []shtypes.BlogEntry

	offset := (pageindex - 1) * pageSize
	limit := pageSize

	query := db.
		Order("priority DESC, created_at DESC").
		Offset(offset).
		Where("tenant_id = ?", tenant).
		Limit(limit).
		Preload("Thumbnail")

	if category != "" {
		query = query.Where("category = ?", category)
	}

	if err := query.Find(&blogEntries).Error; err != nil {
		return nil, err
	}

	return &blogEntries, nil
}