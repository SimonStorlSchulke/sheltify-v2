package shtypes

import (
	"gorm.io/gorm"
)

type AnimalArticle struct {
	gorm.Model
	Title    string
	Animals  []Animal
	TenantID string
	Tenant   *Tenant
}

func (a AnimalArticle) Validate() string {
	return ""
}
