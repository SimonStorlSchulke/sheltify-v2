package shtypes

import (
	"fmt"
	"time"

	"gorm.io/datatypes"
	"gorm.io/gorm"
)

type LogEntry struct {
	gorm.Model
	ID         uint `gorm:"primaryKey"`
	Level      string
	Operation  string
	Path       string
	Message    string
	Tenant     string
	HashedUser string
	Attributes datatypes.JSONMap `gorm:"type:jsonb"`
}

func (l LogEntry) ToString() string {
	str :=
		fmt.Sprintf("%s %s | Path: %s | Operation: %s | Message: %s | Tenant: %s | User: %s",
			time.Now().Format("2006/01/02 - 15:04:05"),
			l.Level,
			l.Path,
			l.Operation,
			l.Message,
			l.Tenant,
			l.HashedUser,
		)

	if l.Attributes != nil {
		str += fmt.Sprintf(" | Attributes: %v", l.Attributes)
	}

	return str
}
