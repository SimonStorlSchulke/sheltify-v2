package shtypes

type Tag struct {
	ShType
	Name       string
	MediaFiles []*MediaFile `gorm:"many2many:media_file_tags;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
	Color      string
}

func (m *Tag) Validate() string {
	return valNotEmpty("Name", m.Name) +
		valMaxLength("Name", m.Name, 32)
}

func (t *Tag) SetTenantId(id string) {
	t.TenantID = id
}
