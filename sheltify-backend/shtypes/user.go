package shtypes

type User struct {
	CmsType
	ID             string `gorm:"primaryKey"`
	HashedPassword string
	Role           string
	SessionToken   *string
	CsrfToken      *string
}
