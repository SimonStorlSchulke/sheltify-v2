package shtypes

type Article struct {
	ShType
	Structure ArticleStructure `gorm:"serializer:json"`
}

func (a *Article) Validate() string {
	return ""
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
	ShType
	HtmlContent string
}

type SectionMedia struct {
	ShType
	TenantID   string
	MediaFiles []*MediaFile `gorm:"many2many:section_media_files;"`
}
