package handlers

import (
	"fmt"
	"net/http"
	"sheltify-backend/logger"
	"sheltify-backend/repository"
	"sheltify-backend/services"
	"sheltify-backend/shtypes"
)

func GetUsers(w http.ResponseWriter, r *http.Request) {

	currentUser := services.UserFromRequest(r)

	if currentUser == nil || currentUser.Role != "SUPERADMIN" {
		forbiddenResponse(w, r, "Only SUPERADMIN can retrieve users")
		return
	}

	users := []shtypes.User{}
	repository.GetUsers(currentUser.TenantID, &users)
	okResponse(w, users)
}

func SaveUser(w http.ResponseWriter, r *http.Request) {
	if !CheckSuperUserRole(w, r) {
		return
	}

	user, err := validateRequestBody[*shtypes.User](w, r)

	if err != nil {
		return
	}

	storedUser, err := repository.GetUserById(user.ID)
	if err != nil {
		internalServerErrorResponse(w, r, fmt.Sprintf("Could not retrieve user: %v", user.ID))
		return
	}

	storedUser.Name = user.Name
	storedUser.Email = user.Email
	storedUser.Role = user.Role
	storedUser.TenantID = user.TenantID

	if repository.SaveUser(storedUser) != nil {
		internalServerErrorResponse(w, r, fmt.Sprintf("Could not save user: %v", storedUser.ID))
	} else {
		logger.Saved(r, storedUser.ID)
		okResponse(w, storedUser)
	}
}

func ChangePassword(w http.ResponseWriter, r *http.Request) {
	if !CheckSuperUserRole(w, r) {
		return
	}

	userId := r.FormValue("userid")
	password := r.FormValue("password")
	hashedPassword, _ := services.HashPassword(password)

	storedUser, err := repository.GetUserById(userId)
	if err != nil {
		internalServerErrorResponse(w, r, fmt.Sprintf("Could not retrieve user: %v", userId))
		return
	}

	storedUser.HashedPassword = hashedPassword

	if repository.SaveUser(storedUser) != nil {
		internalServerErrorResponse(w, r, fmt.Sprintf("Could not save user: %v", storedUser.ID))
	} else {
		logger.Saved(r, storedUser.ID)
		okResponse(w, password)
	}
}

func DeleteUserById(w http.ResponseWriter, r *http.Request) {
	if !CheckSuperUserRole(w, r) {
		return
	}

	userId, err := idFromParameter(w, r)

	currentUser := services.UserFromRequest(r)

	if currentUser == nil || currentUser.ID == userId {
		forbiddenResponse(w, r, "Hey don't delete yourself!")
		return
	}

	if err != nil {
		badRequestResponse(w, r, "Invalid user ID")
		return
	}
	repository.DeleteUserById(userId)
	logger.Deleted(r, userId)
	emptyOkResponse(w)
}
