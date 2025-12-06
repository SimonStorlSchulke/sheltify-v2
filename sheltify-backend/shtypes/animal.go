package shtypes

import (
	"time"
)

type Animal struct {
	CmsType
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
	ArticleID        *string
	Article          *Article `gorm:"->"`
	PortraitID       *string
	Portrait         *MediaFile `gorm:"->"`
	AnimalKind       string
	FreeRoamer       bool
	Race             string
}

func (a *Animal) Validate() string {
	return valMinMaxLength("Name", a.Name, 2, 32) +
		valIsInList("Gender", a.Gender, []string{"male", "female"}) +
		valMaxLength("Description", a.Description, 500) +
		valNotEmpty("Status", a.Status)
}
