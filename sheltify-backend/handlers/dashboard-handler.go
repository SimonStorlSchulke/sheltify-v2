package handlers

import "net/http"

type DashbpardData struct {
	TotalAnimals     int64 `json:"totalAnimals"`
	TotalArticles    int64 `json:"totalArticles"`
	TotalTeamMembers int64 `json:"totalTeamMembers"`
}

func GetDashboardData(w http.ResponseWriter, r *http.Request) {

}
