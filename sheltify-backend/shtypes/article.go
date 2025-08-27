package shtypes

import "gorm.io/gorm"

type Article struct {
	gorm.Model
	Structure ArticleStructure `gorm:"serializer:json"`
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
