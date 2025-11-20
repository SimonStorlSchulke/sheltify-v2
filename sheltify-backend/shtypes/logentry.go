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
	timeStr := time.Now().Format("2006/01/02 - 15:04:05")
	if l.Attributes != nil {
		return fmt.Sprintf("%s - %s: %s %s %s [Tenant: %s, User: %s, Attributes: %v]", timeStr, l.Level, l.Path, l.Operation, l.Message, l.Tenant, l.HashedUser, l.Attributes)
	} else {
		return fmt.Sprintf("%s - %s: %s %s %s [Tenant: %s, User: %s]", timeStr, l.Level, l.Path, l.Operation, l.Message, l.Tenant, l.HashedUser)
	}
}
