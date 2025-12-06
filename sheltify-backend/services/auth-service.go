package services

import (
	"crypto/rand"
	"encoding/base64"
	"log"
	"net/http"
	"sheltify-new-backend/repository"
	"sheltify-new-backend/shtypes"
	"time"

	"golang.org/x/crypto/bcrypt"
)

const BCRYPT_COST = 10

func RegisterUser(w http.ResponseWriter, userName string, email string, password string, tenant string) *shtypes.User {
	if len(userName) < 3 || len(password) < 8 {
		err := http.StatusNotAcceptable
		http.Error(w, "username or password don't meet the requirements", err)
		return nil
	}

	alreadyExists, err := repository.UserAlreadyExistsForTenantAndEmail(email, tenant)

	if err != nil {
		http.Error(w, "failed to check for existing user", http.StatusInternalServerError)
		return nil
	}

	if alreadyExists {
		http.Error(w, "user with given email already exists for tenant", http.StatusConflict)
		return nil
	}

	hashedPassword, _ := HashPassword(password)

	user, err := repository.CreateUser(userName, email, hashedPassword, tenant)

	if err != nil {
		http.Error(w, "failed to create user", http.StatusBadRequest)
		return nil
	}
	return user
}

func Login(w http.ResponseWriter, userName string, password string) *shtypes.User {
	user, err := repository.GetUserByName(userName)

	if err != nil || !CheckPassword(user.HashedPassword, password) {
		http.Error(w, "login credentials incorrect", http.StatusForbidden)
		return nil
	}

	sessionToken := GenerateToken(32)
	csrfToken := GenerateToken(32)

	Set24hCookie(w, "user_name", user.Name, false)
	Set24hCookie(w, "session_token", sessionToken, true)
	Set24hCookie(w, "csrf_token", csrfToken, false)

	user.SessionToken = &sessionToken
	user.CsrfToken = &csrfToken

	err = repository.SaveUser(user)
	if err != nil {
		http.Error(w, "login failed", http.StatusInternalServerError)
		return nil
	}

	//Don't include tokens in response!
	user.SessionToken = nil
	user.CsrfToken = nil
	return user
}

func Logout(w http.ResponseWriter, user *shtypes.User) error {
	user, err := repository.GetUserByName(user.Name)
	ClearCookie(w, "user_name", false)
	ClearCookie(w, "session_token", true)
	ClearCookie(w, "csrf_token", false)

	user.SessionToken = nil
	user.CsrfToken = nil

	err = repository.SaveUser(user)
	if err != nil {
		http.Error(w, "logout failed", http.StatusInternalServerError)
		return err
	}
	return nil
}

func HashPassword(password string) (string, error) {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), BCRYPT_COST)
	return string(hashedPassword), err
}

func CheckPassword(hashedPassword string, enteredPassword string) bool {
	return bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(enteredPassword)) == nil
}

func GenerateToken(length int) string {
	bytes := make([]byte, length)
	if _, err := rand.Read(bytes); err != nil {
		log.Fatalf("Failed to generate Token: %v", err)
	}
	return base64.URLEncoding.EncodeToString(bytes)
}

func Set24hCookie(w http.ResponseWriter, name string, value string, httpOnly bool) {
	log.Println("Set Cookie" + value)
	http.SetCookie(w, &http.Cookie{
		Name:     name,
		Value:    value,
		Path:     "/",
		Expires:  time.Now().Add(24 * time.Hour),
		HttpOnly: httpOnly,
	})
}

func ClearCookie(w http.ResponseWriter, name string, httpOnly bool) {
	http.SetCookie(w, &http.Cookie{
		Name:     name,
		Value:    "",
		Path:     "/",
		Expires:  time.Now().Add(-time.Hour),
		HttpOnly: httpOnly,
	})
}

func Authorize(r *http.Request) (*shtypes.User, error) {
	userName, err := r.Cookie("user_name")
	if err != nil || userName.Value == "" {
		return nil, AuthError
	}
	sessionToken, err := r.Cookie("session_token")
	r.Header.Get("Authorization")

	//TODO send from frontend and get csfr token here from request header instead
	csfrToken, err := r.Cookie("csrf_token")

	if err != nil || sessionToken.Value == "" || csfrToken.Value == "" {
		return nil, AuthError
	}

	user, err := repository.GetUserByName(userName.Value)

	if err != nil ||
		user.SessionToken == nil || *user.SessionToken != sessionToken.Value ||
		user.CsrfToken == nil || *user.CsrfToken != csfrToken.Value {
		return nil, AuthError
	}
	return user, nil
}

func UserFromRequest(r *http.Request) *shtypes.User {
	userValue := r.Context().Value("user")
	if userValue == nil {
		return nil
	}

	user, ok := userValue.(*shtypes.User)
	if !ok {
		return nil
	}
	return user
}
