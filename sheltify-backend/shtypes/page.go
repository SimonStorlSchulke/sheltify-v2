package shtypes

type Page struct {
	Publishable
	Title        string
	Path         string
	Description  string
	ShowInMenu   bool
	LinkInFooter bool
	ArticleID    *string
	Article      *Article `gorm:"onDelete:CASCADE"`
}

func (p *Page) Validate() string {
	return valNotEmpty("Title", p.Title) +
		valMaxLength("Title", p.Title, 128) +
		valIsValidPath("Path", p.Path)
}

func (p *Page) ValidateForPublishing() string {
	return valNotEmpty("Title", p.Title) +
		valMaxLength("Title", p.Title, 128) +
		valMaxLength("Description", p.Description, 512) +
		valMaxLength("Path", p.Path, 256) +
		valIsValidPath("Path", p.Path)
}
