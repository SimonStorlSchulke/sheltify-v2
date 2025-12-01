package shtypes

type Article struct {
	CmsType
	Structure ArticleStructure `gorm:"serializer:json"`
}

func (a *Article) Validate() string {
	return ""
}

type ArticleStructure struct {
	Rows []*ArticleRow
}

type ArticleRow struct {
	Sections []*ArticleSection
}

type ArticleSection struct {
	SectionType string
	Content     interface{}
}
