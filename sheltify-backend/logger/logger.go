package logger

import (
	"crypto/sha1"
	"encoding/base64"
	"fmt"
	"net/http"
	"sheltify-new-backend/repository"
	"sheltify-new-backend/shtypes"
)

func RequestError(r *http.Request, whichOne any, err error) shtypes.LogEntry {
	return Audited(r, shtypes.LogEntry{
		Level:   "ERROR",
		Message: fmt.Sprintf("with %v: %s", whichOne, err.Error()),
	})
}

func Deleted(r *http.Request, whichOne any) shtypes.LogEntry {
	return Audited(r, shtypes.LogEntry{
		Level:     "INFO",
		Operation: "DELETE",
		Message:   fmt.Sprintf("%v", whichOne),
	})
}

func Created(r *http.Request, whichOne any) shtypes.LogEntry {
	return Audited(r, shtypes.LogEntry{
		Level:     "INFO",
		Operation: "CREATE",
		Message:   fmt.Sprintf("%v", whichOne),
	})
}

func Saved(r *http.Request, whichOne any) shtypes.LogEntry {
	return Audited(r, shtypes.LogEntry{
		Level:     "INFO",
		Operation: "UPDATE",
		Message:   fmt.Sprintf("%v", whichOne),
	})
}

func Info(r *http.Request, message string) shtypes.LogEntry {
	return Audited(r, shtypes.LogEntry{
		Level:   "INFO",
		Message: message,
	})
}

func Warn(r *http.Request, message string) shtypes.LogEntry {
	return Audited(r, shtypes.LogEntry{
		Level:   "WARN",
		Message: message,
	})
}

func Error(r *http.Request, message string) shtypes.LogEntry {
	return Audited(r, shtypes.LogEntry{
		Level:   "ERROR",
		Message: message,
	})
}

func Audited(r *http.Request, entry shtypes.LogEntry) shtypes.LogEntry {
	user := UserFromRequest(r)
	if user == nil {
		return entry
	}
	entry.HashedUser = shortHash(user.ID)
	entry.Tenant = user.TenantID
	entry.Path = r.URL.Path
	if entry.Operation == "" {
		entry.Operation = r.Method
	}
	fmt.Println(entry.ToString())
	repository.CreateLog(&entry)
	return entry
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
