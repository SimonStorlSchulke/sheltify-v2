package handlers

import (
	"net/http"
	"sheltify-new-backend/logger"
	"sheltify-new-backend/repository"
	"sheltify-new-backend/shtypes"
)

func GetTeamMembers(w http.ResponseWriter, r *http.Request) {
	teamMembers := []*shtypes.TeamMember{}
	DefaultGetAll(w, r, &teamMembers, "Portrait")
}

func GetTeamMemberById(w http.ResponseWriter, r *http.Request) {
	teamMember := &shtypes.TeamMember{}
	DefaultGetById(w, r, teamMember, "Portrait")
}

func SaveTeamMember(w http.ResponseWriter, r *http.Request) {
	teamMember, err := validateRequestBody[*shtypes.TeamMember](w, r)
	if err != nil {
		return
	}

	if teamMember.Portrait != nil {
		teamMember.PortraitID = &teamMember.Portrait.ID
	}

	if repository.SaveTeamMember(teamMember) != nil {
		internalServerErrorResponse(w, r, "Could not save team member")
	} else {
		logger.Saved(r, teamMember.ID)
		okResponse(w, teamMember)
	}
}

func DeleteTeamMember(w http.ResponseWriter, r *http.Request) {
	DefaultDeleteByIds[*shtypes.TeamMember](w, r, true)
}
