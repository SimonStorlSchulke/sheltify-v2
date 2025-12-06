package shtypes

type User struct {
	CmsType
	Name           string
	Email          string
	HashedPassword string
	Role           string
	SessionToken   *string
	CsrfToken      *string
}
