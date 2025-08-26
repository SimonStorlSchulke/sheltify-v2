package shtypes

import "gorm.io/gorm"

type Article struct {
	gorm.Model
	Rows []*ArticleRow `gorm:"foreignKey:ArticleID"`
}

type ArticleRow struct {
	gorm.Model
	ArticleID uint
	Position  int                  //for ordering
	Sections  []*ArticleSectionRef `gorm:"foreignKey:ArticleRowID"`
}

type ArticleSectionRef struct {
	gorm.Model
	ArticleRowID uint
	SectionID    uint
	SectionType  string
	Position     int //for ordering
}

type TextSection struct {
	gorm.Model
	HtmlContent string
}

type MediaSection struct {
	gorm.Model
	MediaFiles []*MediaFile `gorm:"many2many:media_section_files;"`
}
