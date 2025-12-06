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

func DefaultGetById[T any](id int, tenant string, out *T, preloads ...string) error {
	q := db
	for _, p := range preloads {
		q = q.Preload(p)
	}
	if err := q.Where("tenant_id = ?", tenant).First(out, id).Error; err != nil {
		return err
	}
	return nil
}

func DefaultGetByField[T any](field string, value any, tenant string, out *T, preloads ...string) error {
	q := db
	for _, p := range preloads {
		q = q.Preload(p)
	}
	if err := q.Where("tenant_id = ?", tenant).Where(field+" = ?", value).First(out).Error; err != nil {
		return err
	}
	return nil
}

func DefaultDeleteByIds[T any](ids []int, tenantId string) error {
	var model T

	return db.
		Unscoped().
		Where("tenant_id = ?", tenantId).
		Where("id IN ?", ids).
		Delete(&model).
		Error
}
