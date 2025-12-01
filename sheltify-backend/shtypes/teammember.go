package shtypes

type TeamMember struct {
	CmsType
	Name        string
	Role        string
	Description string
	EMail       string
	Phone       string
	Priority    int
	PortraitID  *string
	Portrait    *MediaFile
}

func (a *TeamMember) Validate() string {
	return valMinMaxLength("Name", a.Name, 2, 32) +
		valMaxLength("Description", a.Description, 500)
}
