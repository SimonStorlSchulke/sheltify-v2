package shtypes

type User struct {
	ShType
	ID             string `gorm:"primaryKey"`
	HashedPassword string
	SessionToken   *string
	CsrfToken      *string
}
