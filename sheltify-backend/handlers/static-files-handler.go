package handlers

import (
	"net/http"
	"strings"

	"github.com/go-chi/chi/v5"
)

func FileServer(r chi.Router, path string, root http.FileSystem) {
	if strings.ContainsAny(path, "{}*") {
		panic("FileServer does not permit any URL parameters.")
	}

	if path != "/" && path[len(path)-1] != '/' {
		r.Get(path, http.RedirectHandler(path+"/", 301).ServeHTTP)
		path += "/"
	}
	path += "*"

	r.Get(path, func(w http.ResponseWriter, r *http.Request) {
		rctx := chi.RouteContext(r.Context())
		pathPrefix := strings.TrimSuffix(rctx.RoutePattern(), "/*")
		if strings.HasSuffix(strings.ToLower(r.URL.Path), ".svg") {
			// prevent scripts inside uploaded svgs from running when the file is opened directly
			w.Header().Set("Content-Security-Policy", "default-src 'none'; style-src 'unsafe-inline'; img-src data:; sandbox")
		}
		if r.URL.Query().Has("v") {
			// versioned urls (?v=<last change>, see getImagePath in sheltify-lib) change whenever the file is replaced
			w.Header().Set("Cache-Control", "public, max-age=31536000, immutable")
		}
		fs := http.StripPrefix(pathPrefix, http.FileServer(root))
		fs.ServeHTTP(w, r)
	})
}
