package migrations

import (
	"sheltify-new-backend/shtypes"

	"gorm.io/gorm"
)

func Migrate(db *gorm.DB) {
	db.AutoMigrate(
		&shtypes.Tenant{},
		&shtypes.TenantConfiguration{},
		&shtypes.Article{}, // Parent first
		&shtypes.Animal{},  // Children after
		&shtypes.Page{},
		&shtypes.MediaFile{},
		&shtypes.Tag{},
		&shtypes.User{},
		&shtypes.LogEntry{},
	)
}
