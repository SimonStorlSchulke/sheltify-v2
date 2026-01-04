package shtypes

type Article struct {
	CmsType
	Structure ArticleStructure `gorm:"serializer:json"`
}

func (a *Article) Validate() string {
	return ""
}

type ArticleStructure struct {
	Rows []*ArticleSection
}

type ArticleSection struct {
	BackgroundColor string
	SectionType     string
	Content         interface{}
}
