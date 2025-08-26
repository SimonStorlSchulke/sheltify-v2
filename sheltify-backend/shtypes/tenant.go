package shtypes

import (
	"errors"
	"regexp"

	"gorm.io/gorm"
)

type Tenant struct {
	gorm.Model
	ID   string `gorm:"primaryKey"`
	Name string
}

func (t *Tenant) BeforeSave(tx *gorm.DB) error {
	match, _ := regexp.MatchString(`^[a-z]+$`, t.ID)
	if !match {
		return errors.New("tenant identifier can only constsit of letters and '-'")
	}
	return nil
}
