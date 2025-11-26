package shtypes

import (
	"time"
)

type Animal struct {
	ShType
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
	ArticleID        *uint
	Article          *Article `gorm:"->"`
	PortraitID       *string
	Portrait         *MediaFile `gorm:"->"`
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
