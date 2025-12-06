package handlers

import (
	"net/http"
	"sheltify-new-backend/services"
)

func Register(w http.ResponseWriter, r *http.Request) {
	userName := r.FormValue("username")
	email := r.FormValue("email")
	password := r.FormValue("password")
	tenant := r.FormValue("tenant")

	user := services.RegisterUser(w, userName, email, password, tenant)
	if user == nil {
		return
	}

	createdResponse(w, user)
}

func Login(w http.ResponseWriter, r *http.Request) {
	userName := r.FormValue("username")
	password := r.FormValue("password")

	user := services.Login(w, userName, password)

	if user == nil {
		return
	}
	okResponse(w, user)
}

func Logout(w http.ResponseWriter, r *http.Request) {

	user := services.UserFromRequest(r)

	if user == nil {
		http.Error(w, "User not found in context", http.StatusUnauthorized)
		return
	}

	services.Logout(w, user)

	emptyOkResponse(w)
}

func Relogin(w http.ResponseWriter, r *http.Request) {
	user := services.UserFromRequest(r)

	if user == nil {
		http.Error(w, "no logged in user found", http.StatusUnauthorized)
		return
	}

	okResponse(w, user)
}
