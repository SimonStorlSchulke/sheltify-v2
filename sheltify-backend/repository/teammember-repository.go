package repository

import "sheltify-new-backend/shtypes"

func SaveTeamMember(teamMember *shtypes.TeamMember) error {
	if err := db.Save(&teamMember).Error; err != nil {
		return err
	}
	return nil
}
