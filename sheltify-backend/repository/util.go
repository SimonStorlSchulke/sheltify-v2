package repository

func DefaultGetAll[T any](tenant string, out *[]T, preloads ...string) error {
	q := db

	for _, p := range preloads {
		q = q.Preload(p)
	}

	if err := q.Where("tenant_id = ?", tenant).Find(out).Error; err != nil {
		return err
	}
	return nil
}

func DefaultGetByID[T any](id string, tenant string, out *T, preloads ...string) error {
	q := db
	for _, p := range preloads {
		q = q.Preload(p)
	}
	if err := q.Where("tenant_id = ? AND id = ?", tenant, id).First(out).Error; err != nil {
		return err
	}
	return nil
}

func DefaultGetByIDs[T any](ids []string, tenant string, out *T, preloads ...string) error {
	q := db
	for _, p := range preloads {
		q = q.Preload(p)
	}
	if err := q.Where("tenant_id = ? AND id IN ?", tenant, ids).Find(out).Error; err != nil {
		return err
	}
	return nil
}

func DefaultGetLastModified[T any](tenant string, amount int, out *T, preloads ...string) error {
	q := db
	for _, p := range preloads {
		q = q.Preload(p)
	}

	err := q.
		Where("tenant_id = ?", tenant).
		Order("updated_at DESC").
		Limit(amount).
		Find(out).Error

	if err != nil {
		return err
	}
	return nil
}

func DefaultGetByField[T any](field string, value any, tenant string, out *T, preloads ...string) error {
	q := db
	for _, p := range preloads {
		q = q.Preload(p)
	}
	if err := q.Where("tenant_id = ?", tenant).Where(field+" = ?", value).Find(out).Error; err != nil {
		return err
	}
	return nil
}

func DefaultDeleteByIDS[T any](ids []string, tenantId string) error {
	var model T

	return db.
		Unscoped().
		Where("tenant_id = ?", tenantId).
		Where("id IN ?", ids).
		Delete(&model).
		Error
}

func DeleteOrphanedArticles(tenantId string) error {
	sql := `
      DELETE FROM articles
      WHERE tenant_id = ?
        AND id NOT IN (SELECT article_id FROM animals WHERE tenant_id = ? AND article_id IS NOT NULL)
        AND id NOT IN (SELECT article_id FROM pages WHERE tenant_id = ? AND article_id IS NOT NULL)
    `
	return db.Exec(sql, tenantId, tenantId, tenantId).Error
}
