package logger

import (
	"crypto/sha1"
	"encoding/base64"
	"fmt"
	"net/http"
	"sheltify-new-backend/repository"
	"sheltify-new-backend/shtypes"
	"strconv"
)

func RequestError(r *http.Request, dataType string, whichOne string, err error) {
	Audited(r, shtypes.LogEntry{
		Level:   "error",
		Message: "with " + dataType + " " + whichOne + ": " + err.Error(),
	})
}

func Deleted(r *http.Request, dataType string, whichOne string) {
	Audited(r, shtypes.LogEntry{
		Level:   "info",
		Message: dataType + " " + whichOne,
	})
}

func Created(r *http.Request, dataType string, whichOne string) {
	Audited(r, shtypes.LogEntry{
		Level:   "info",
		Message: dataType + " " + whichOne,
	})
}

func Saved(r *http.Request, dataType string, whichOne string) {
	Audited(r, shtypes.LogEntry{
		Level:   "info",
		Message: dataType + " " + whichOne,
	})
}

func Info(r *http.Request, message string) {
	Audited(r, shtypes.LogEntry{
		Level:   "info",
		Message: message,
	})
}

func Warn(r *http.Request, message string) {
	Audited(r, shtypes.LogEntry{
		Level:   "warn",
		Message: message,
	})
}

func Error(r *http.Request, message string) {
	Audited(r, shtypes.LogEntry{
		Level:   "error",
		Message: message,
	})
}

func Int(integer int) string {
	return strconv.Itoa(integer)
}

func Ints(array []int) string {
	b := ""
	for _, v := range array {
		if len(b) > 0 {
			b += ","
		}
		b += strconv.Itoa(v)
	}

	return "[" + b + "]"
}

func Audited(r *http.Request, entry shtypes.LogEntry) {
	user := UserFromRequest(r)
	entry.HashedUser = shortHash(user.ID)
	entry.Tenant = *user.TenantID
	entry.Path = r.URL.Path
	if entry.Operation == "" {
		entry.Operation = r.Method
	}
	fmt.Println(entry.ToString())
	repository.CreateLog(&entry)
}

func Entry(entry shtypes.LogEntry) {
	fmt.Println(entry.ToString())
	repository.CreateLog(&entry)
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

func shortHash(s string) string {
	h := sha1.New()
	h.Write([]byte(s))
	sum := h.Sum(nil)
	return base64.RawURLEncoding.EncodeToString(sum[:8])
}
