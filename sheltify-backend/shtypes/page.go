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
	return valMaxLength("Pfad", p.Path, 256)
}

func (p *Page) ValidateForPublishing() string {
	return valNotEmpty("Pfad", p.Path) +
		valMaxLength("Pfad", p.Path, 256) +
		valMaxLength("Beschreibung", p.Description, 512)
}
