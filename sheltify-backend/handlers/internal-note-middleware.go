package handlers

import (
	"bytes"
	"encoding/json"
	"net/http"
	"sheltify-backend/services"
	"strings"

	"github.com/go-chi/chi/v5"
)

const internalNoteField = "InternalNote"

// StripInternalNotes removes every "InternalNote" field from JSON responses
// unless the request comes from an authenticated CMS user of the requested
// tenant (or a SUPERADMIN). Internal notes are meant for CMS users only
func StripInternalNotes(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if mayReadInternalNotes(r) {
			next.ServeHTTP(w, r)
			return
		}

		buffered := &bufferedResponseWriter{header: http.Header{}, status: http.StatusOK}
		next.ServeHTTP(buffered, r)

		body := buffered.body.Bytes()
		if strings.HasPrefix(buffered.header.Get("Content-Type"), "application/json") {
			if stripped, err := stripInternalNotesFromJson(body); err == nil {
				body = stripped
			}
		}

		for key, values := range buffered.header {
			w.Header()[key] = values
		}
		w.Header().Del("Content-Length")
		w.WriteHeader(buffered.status)
		w.Write(body)
	})
}

func mayReadInternalNotes(r *http.Request) bool {
	user, err := services.Authorize(r)
	if err != nil || user == nil {
		return false
	}
	if user.Role == "SUPERADMIN" {
		return true
	}
	tenant := chi.URLParam(r, "tenant")
	return tenant != "" && user.TenantID == tenant
}

func stripInternalNotesFromJson(body []byte) ([]byte, error) {
	decoder := json.NewDecoder(bytes.NewReader(body))
	decoder.UseNumber()
	var data any
	if err := decoder.Decode(&data); err != nil {
		return nil, err
	}
	removeInternalNotes(data)

	var out bytes.Buffer
	encoder := json.NewEncoder(&out)
	encoder.SetEscapeHTML(true)
	if err := encoder.Encode(data); err != nil {
		return nil, err
	}
	return out.Bytes(), nil
}

func removeInternalNotes(value any) {
	switch v := value.(type) {
	case map[string]any:
		delete(v, internalNoteField)
		for _, child := range v {
			removeInternalNotes(child)
		}
	case []any:
		for _, child := range v {
			removeInternalNotes(child)
		}
	}
}

type bufferedResponseWriter struct {
	header http.Header
	body   bytes.Buffer
	status int
}

func (b *bufferedResponseWriter) Header() http.Header         { return b.header }
func (b *bufferedResponseWriter) Write(p []byte) (int, error) { return b.body.Write(p) }
func (b *bufferedResponseWriter) WriteHeader(status int)      { b.status = status }
