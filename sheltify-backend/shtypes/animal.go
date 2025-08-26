package shtypes

import (
	"time"

	"gorm.io/gorm"
)

type Animal struct {
	gorm.Model
	Name             string
	Birthday         *time.Time
	WeightKg         uint
	ShoulderHeightCm uint
	Castrated        bool
	Gender           string
	Description      string
	Patrons          string
	Status           string //TODO possible values could be tenant specific?
	Health           string
	Priority         int
	AnimalArticleID  *uint
	AnimalArticle    *AnimalArticle
	PortraitID       *string
	Portrait         *MediaFile `gorm:"->"`
	TenantID         string
	Tenant           *Tenant
}

func (a *Animal) Validate() string {
	return valMinMaxLength("Name", a.Name, 2, 32) +
		valIsInList("Gender", a.Gender, []string{"male", "female"}) +
		valMaxLength("Description", a.Description, 500) +
		valNotEmpty("Status", a.Status)
}

func (a *Animal) SetTenantId(id string) {
	a.TenantID = id
}
