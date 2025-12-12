package shtypes

type Tag struct {
	CmsType
	Name       string
	MediaFiles []*MediaFile `gorm:"many2many:media_file_tags;constraint:OnDelete:CASCADE;"`
	Color      string
}

func (m *Tag) Validate() string {
	return valNotEmpty("Name", m.Name) +
		valMaxLength("Name", m.Name, 32)
}
