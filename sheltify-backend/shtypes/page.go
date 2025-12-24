package shtypes

type Page struct {
	Publishable
	Path         string
	Priority     int
	Description  string
	ShowInMenu   bool
	LinkInFooter bool
	ArticleID    *string
	Article      *Article `gorm:"onDelete:CASCADE"`
}

func (p *Page) Validate() string {
	return valNotEmpty("Title", p.Path) +
		valMaxLength("Title", p.Path, 256)
}

func (p *Page) ValidateForPublishing() string {
	return valNotEmpty("Title", p.Path) +
		valMaxLength("Title", p.Path, 256) +
		valMaxLength("Description", p.Description, 512)
}
