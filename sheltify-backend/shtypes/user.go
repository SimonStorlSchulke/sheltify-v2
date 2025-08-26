package shtypes

import "gorm.io/gorm"

type User struct {
	gorm.Model
	ID             string `gorm:"primaryKey"`
	HashedPassword string
	SessionToken   *string
	CsrfToken      *string
	TenantID       *string
	Tenant         *Tenant
}
