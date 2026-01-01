package shtypes

type HomeFoundEntry struct {
	CmsType
	AnimalName string
	Content    HomeFoundContent `gorm:"serializer:json"`
}

type HomeFoundContent struct {
	Html       string
	MediaFiles []MediaFile
}
