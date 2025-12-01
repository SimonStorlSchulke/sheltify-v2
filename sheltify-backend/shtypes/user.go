package shtypes

type User struct {
	CmsType
	ID             string `gorm:"primaryKey"`
	HashedPassword string
	SessionToken   *string
	CsrfToken      *string
}
