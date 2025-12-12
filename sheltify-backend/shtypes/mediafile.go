package shtypes

type MediaFile struct {
	CmsType
	ExternalLink         string
	OriginalFileName     string
	Title                string
	Description          string
	FocusX               float32
	FocusY               float32
	SizesGenerated       bool
	LargestAvailableSize string
	MediaTags            []*Tag    `gorm:"many2many:media_file_tags;constraint:OnDelete:CASCADE;"`
	TaggedAnimals        []*Animal `gorm:"many2many:media_file_animals;constraint:OnDelete:CASCADE;"`
	RotationSteps        int8      // 0-3, each step is 90 degrees clockwise
}

func (m *MediaFile) Validate() string {
	if (m.RotationSteps < 0) || (m.RotationSteps > 3) {
		return "RotationSteps must be between 0 and 3"
	}
	return ""
}
