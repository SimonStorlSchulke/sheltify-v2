package shtypes

import "gorm.io/gorm"

type CmsType struct {
	gorm.Model
	TenantID string
	Tenant   *Tenant
}

func (m *CmsType) SetTenantId(id string) {
	if m.TenantID == "" {
		m.TenantID = id
	}
}

func (m *CmsType) GetTenantId() string {
	return m.TenantID
}

func (a *CmsType) Validate() string {
	return ""
}
