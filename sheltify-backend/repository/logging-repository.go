package repository

import "sheltify-new-backend/shtypes"

func CreateLog(log *shtypes.LogEntry) error {
	if err := db.Create(&log).Error; err != nil {
		return err
	}
	return nil
}
