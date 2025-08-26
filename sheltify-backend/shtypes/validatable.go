package shtypes

type Validatable interface {
	// Validate returns empty string if validation succeeded, else a list of errormessages
	Validate() string
	SetTenantId(id string)
}
