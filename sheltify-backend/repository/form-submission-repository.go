package repository

import (
	"sheltify-new-backend/shtypes"
)

func SaveFormSubmission(formSubmission *shtypes.FormSubmission) error {
	if err := db.Save(&formSubmission).Error; err != nil {
		return err
	}
	return nil
}

func GetFormSubmissionsByTenant(tenant string) ([]*shtypes.FormSubmission, error) {
	var forms []*shtypes.FormSubmission

	q := db.Model(&shtypes.FormSubmission{}).Select("id, created_at, updated_at, deleted_at, tenant_id, last_modified_by, type, sender_mail")

	if err := q.Where("tenant_id = ?", tenant).Find(&forms).Error; err != nil {
		return nil, err
	}
	return forms, nil
}
