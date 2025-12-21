package shtypes

import (
	"database/sql"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type TenantConfiguration struct {
	gorm.Model
	ID                        string `gorm:"primaryKey;type:char(36)"`
	TenantID                  string `gorm:"uniqueIndex"`
	Name                      string
	SiteUrl                   string
	CmsShowAnimalKindSelector bool
	Address                   string
	PhoneNumber               string
	Email                     string
	ArticleCss                string
	IBAN                      string
	LinkPaypal                string
	LinkFacebook              string
	LinkInstagram             string
	LinkTiktok                string
	LinkYoutube               string
	AnimalKinds               string //comma separated list
	AnimalStati               string //comma separated list
	BlogCategories            string //comma separated list
	DefaultAnimalKind         string
	LastModifiedBy            string
	LogoHeader                *MediaFile `gorm:"->"`
	LogoHeaderID              *string
	AnimalFeatureWhere        bool
	AnimalFeaturePatrons      bool
	AnimalFeatureRace         bool
	AnimalFeatureAnimalKind   bool
	LastBuild                 sql.NullTime

	AnimalFilterConfigForAnimalKind map[string]AnimalFilterConfiguration `gorm:"serializer:json"`
}

func (m *TenantConfiguration) SetTenantId(id string) {
	if m.TenantID == "" {
		m.TenantID = id
	}
}

func (m *TenantConfiguration) GetTenantId() string {
	return m.TenantID
}

func (m *TenantConfiguration) Validate() string {
	return ""
}

func (m *TenantConfiguration) GetUUId() string {
	return m.ID
}

func (c *TenantConfiguration) BeforeCreate(tx *gorm.DB) (err error) {
	if c.ID == "" {
		c.ID = uuid.NewString()
	}
	return nil
}

func (c *TenantConfiguration) GetLastModifiedBy() string {
	return c.LastModifiedBy
}

func (cmsType *TenantConfiguration) SetLastModifiedBy(userId string) {
	if userId != "" {
		cmsType.LastModifiedBy = userId
	}
}

type AnimalFilterConfiguration struct {
	AgeSteps             []int // for dynamic filtering by age eg: [1,3,6] ->  < 1y Welpen, 1-3y Jungtiere, 3-6y Erwachsene, >6y Senioren
	SizeSteps            []int // for dynamic filtering by size eg: [30,50] -> <30cm Small, 30-50cm Medium, >50cm Large
	BySponsorsSearched   bool  // whether allow filtering by sponsors searched (Paten gesucht) for AnimalKind
	ByInGermanySearched  bool  // whether allow filtering by inGermany (Tier befindet sich In Deutschland) for AnimalKind
	ByFreeRoamerSearched bool  // whether allow filtering by free roamer (Freigänger) for AnimalKind
}
