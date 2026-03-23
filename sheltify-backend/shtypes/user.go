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

var BypassAuthUser = User{
	Name: "BypassAuthUser",
	Role: "admin",
	CmsType: CmsType{
		TenantID: "snhg", //todo
	},
}