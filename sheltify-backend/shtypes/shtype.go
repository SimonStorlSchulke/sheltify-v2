package shtypes

import "gorm.io/gorm"

type CmsType struct {
	gorm.Model
	TenantID string
	Tenant   *Tenant
}

func (m *CmsType) SetTenantId(id string) {
	m.TenantID = id
}

func (a *CmsType) Validate() string {
	return ""
}
