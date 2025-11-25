package shtypes

import "gorm.io/gorm"

type Article struct {
	gorm.Model
	TenantID  string
	Structure ArticleStructure `gorm:"serializer:json"`
}

func (a *Article) Validate() string {
	return ""
}

func (a *Article) SetTenantId(id string) {
	a.TenantID = id
}

type ArticleStructure struct {
	Rows []*ArticleRow
}

type ArticleRow struct {
	Sections []*ArticleSectionRef
}

type ArticleSectionRef struct {
	SectionType string
	SectionID   uint
}

type SectionText struct {
	gorm.Model
	HtmlContent string
}

type SectionMedia struct {
	gorm.Model
	MediaFiles []*MediaFile `gorm:"many2many:section_media_files;"`
}
