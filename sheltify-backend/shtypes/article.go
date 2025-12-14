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
	BackgroundColor string
	Width           string
	SectionType     string
	Content         interface{}
}
