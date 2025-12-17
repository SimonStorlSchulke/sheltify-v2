package shtypes

type BlogEntry struct {
	Publishable
	Title       string
	Category    string
	Description string
	ShowPopup   bool
	ThumbnailID *string
	Thumbnail   *MediaFile `gorm:"->"`
	ArticleID   *string
	Article     *Article `gorm:"onDelete:CASCADE"`
}

func (p *BlogEntry) Validate() string {
	return valNotEmpty("Title", p.Title) +
		valMaxLength("Title", p.Title, 128)
}

func (p *BlogEntry) ValidateForPublishing() string {
	return valNotEmpty("Title", p.Title) +
		valMaxLength("Title", p.Title, 128) +
		valMaxLength("Description", p.Description, 512) +
		valNotEmpty("Category", p.Category)
}
