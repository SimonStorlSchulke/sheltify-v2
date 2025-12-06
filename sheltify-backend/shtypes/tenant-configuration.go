package shtypes

import (
	"gorm.io/datatypes"
	"gorm.io/gorm"
)

type TenantConfiguration struct {
	gorm.Model
	TenantID                  string         `gorm:"uniqueIndex"` // ensures one-to-one
	AnimalKinds               datatypes.JSON `gorm:"type:json"`
	DefaultAnimalKind         string
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
}

func (c *TenantConfiguration) SetTenantId(id string) {
	c.TenantID = id
}

func (c *TenantConfiguration) Validate() string {
	return ""
}
