package shtypes

type Page struct {
	CmsType
	Title       string
	Path        string
	Description string
	ArticleID   *string
	Article     *Article
}

func (p *Page) Validate() string {
	return valNotEmpty("Title", p.Title) +
		valMaxLength("Title", p.Title, 128) +
		valMaxLength("Description", p.Description, 512) +
		valMaxLength("Path", p.Path, 256) +
		valIsValidPath("Path", p.Path)
}
