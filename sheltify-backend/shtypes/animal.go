package shtypes

import (
	"database/sql"
	"time"
)

type Animal struct {
	Publishable
	Name             string
	Birthday         *time.Time
	WeightKg         uint
	ShoulderHeightCm uint
	Castrated        sql.NullBool
	Gender           string
	Where            string
	Description      string
	NotesIntern      string //TODO
	Patrons          string
	Status           string
	Health           string
	Priority         int
	ArticleID        *string
	Article          *Article `gorm:"->;"`
	PortraitID       *string
	Portrait         *MediaFile `gorm:"->"`
	AnimalKind       string
	FreeRoamer       sql.NullBool
	NoAdoption       bool
	Race             string
	MediaFiles       []*MediaFile `gorm:"many2many:media_file_animals;constraint:OnDelete:CASCADE;"`
}

func (a *Animal) Validate() string {
	return valMinMaxLength("Name", a.Name, 2, 32)
}

func (a *Animal) ValidateForPublishing() string {
	articleIDErr := ""
	if a.ArticleID == nil || *a.ArticleID == "" {
		articleIDErr = "Artikel zum Tier muss bestehen\n"
	}
	return a.Validate() +
		valNotEmpty("Status", a.Status) +
		valMaxLength("Beschreibung", a.Description, 500) +
		valIsInList("Geschlecht", a.Gender, []string{"male", "female"}) +
		valNotEmpty("Tierart", a.AnimalKind) +
		articleIDErr
}
