package migrations

import (
	"sheltify-new-backend/shtypes"

	"gorm.io/gorm"
)

func Migrate(db *gorm.DB) {
	db.AutoMigrate(
		&shtypes.Tenant{},
		&shtypes.TenantConfiguration{},
		&shtypes.Animal{},
		&shtypes.MediaFile{},
		&shtypes.Tag{},
		&shtypes.User{},
		&shtypes.MediaFile{},
		&shtypes.Article{},
		&shtypes.LogEntry{},
	)
}
