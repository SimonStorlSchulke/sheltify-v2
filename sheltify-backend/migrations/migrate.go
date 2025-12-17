package migrations

import (
	"sheltify-new-backend/shtypes"

	"gorm.io/gorm"
)

func Migrate(db *gorm.DB) {
	db.AutoMigrate(
		&shtypes.Tenant{},
		&shtypes.TenantConfiguration{},
		&shtypes.Article{},
		&shtypes.Animal{},
		&shtypes.Page{},
		&shtypes.BlogEntry{},
		&shtypes.MediaFile{},
		&shtypes.TeamMember{},
		&shtypes.Tag{},
		&shtypes.User{},
		&shtypes.LogEntry{},
	)
}
