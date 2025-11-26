package shtypes

import "gorm.io/gorm"

type ShType struct {
	gorm.Model
	TenantID string
	Tenant   *Tenant
}

func (m *ShType) SetTenantId(id string) {
	m.TenantID = id
}

func (a *ShType) Validate() string {
	return ""
}
