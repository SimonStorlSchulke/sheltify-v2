package shtypes

import (
	"database/sql"

	"gorm.io/gorm"
)

type Publishable struct {
	CmsType
	PublishedAt sql.NullTime
}

func (p *Publishable) ValidateForPublishing(tx *gorm.DB) string {
	return p.Validate()
}

func (p *Publishable) GetPubhlishedAt() sql.NullTime {
	return p.PublishedAt
}
