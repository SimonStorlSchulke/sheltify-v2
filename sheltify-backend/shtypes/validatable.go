package shtypes

import (
	"database/sql"
)

type Validatable interface {
	// Validate returns empty string if validation succeeded, else a list of errormessages
	Validate() string
	SetTenantId(id string)
	GetTenantId() string
	GetUUId() string
	SetLastModifiedBy(userName string)
}

type ValidatableForPublishing interface {
	Validatable
	GetPubhlishedAt() sql.NullTime
	ValidateForPublishing() string
}
