package shtypes

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type CmsType struct {
	ID        string `gorm:"primaryKey;type:char(36)"`
	CreatedAt time.Time
	UpdatedAt time.Time
	DeletedAt gorm.DeletedAt `gorm:"index"`
	TenantID  string
	Tenant    *Tenant
}

func (m *CmsType) SetTenantId(id string) {
	if m.TenantID == "" {
		m.TenantID = id
	}
}

func (m *CmsType) GetTenantId() string {
	return m.TenantID
}

func (m *CmsType) Validate() string {
	return ""
}

func (m *CmsType) GetUUId() string {
	return m.ID
}

func (c *CmsType) BeforeCreate(tx *gorm.DB) (err error) {
	if c.ID == "" {
		c.ID = uuid.NewString()
	}
	return nil
}
