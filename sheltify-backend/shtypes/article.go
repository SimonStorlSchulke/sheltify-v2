package shtypes

import "gorm.io/gorm"

type Article struct {
	gorm.Model
	Sections []ArticleSectionRef
}

type ArticleSectionRef struct {
	gorm.Model
	ArticleID   uint
	SectionID   uint
	SectionType string
}

type TextSection struct {
	gorm.Model
	HtmlContent string
}

type MediaSection struct {
	gorm.Model
	MediaFiles []*MediaFile `gorm:"many2many:media_section_files;"`
}

type ColumnsSection struct {
	gorm.Model
	Sections []*ArticleSectionRef
}
