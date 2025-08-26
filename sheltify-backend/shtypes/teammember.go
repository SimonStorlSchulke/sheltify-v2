package shtypes

import (
	"gorm.io/gorm"
)

type TeamMember struct {
	gorm.Model
	Name        string
	Role        string
	Description string
	EMail       string
	Phone       string
	Priority    int
	PortraitID  *string
	Portrait    *MediaFile
	TenantID    string
	Tenant      *Tenant
}

func (a *TeamMember) Validate() string {
	return valMinMaxLength("Name", a.Name, 2, 32) +
		valMaxLength("Description", a.Description, 500)
}
