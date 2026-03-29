package handlers

import (
	"fmt"
	"net/http"
	"sheltify-new-backend/logger"
	"sheltify-new-backend/repository"
	"sheltify-new-backend/shtypes"
	"strconv"
)

func GetBlogEntries(w http.ResponseWriter, r *http.Request) {
	var blogEntries []*shtypes.BlogEntry
	DefaultGetAll(w, r, &blogEntries, "Thumbnail")
}

func GetByPaginationBlogEntries(w http.ResponseWriter, r *http.Request) {
	tenant, err := tenantFromParameter(w, r)
	if err != nil {
		return
	}

	pageSize := r.URL.Query().Get("pageSize")
	pageIndex := r.URL.Query().Get("pageIndex")
	category := r.URL.Query().Get("category")

	pageSizeInt, err := strconv.Atoi(pageSize)
	if err != nil || pageSizeInt <= 0 {
		badRequestResponse(w, r, "Invalid pageSize parameter")
		return
	}
	pageIndexInt, err := strconv.Atoi(pageIndex)
	if err != nil || pageIndexInt <= 0 {
		badRequestResponse(w, r, "Invalid pageIndex parameter")
		return
	}

	blogEntries, err := repository.GetByPaginationBlogEntries(tenant, pageSizeInt, pageIndexInt, category)
	if err != nil {
		internalServerErrorResponse(w, r, "Error fetching blog entries")
		return
	}
	okResponse(w, blogEntries)
}

func GetBlogEntryById(w http.ResponseWriter, r *http.Request) {
	var blogEntry *shtypes.BlogEntry
	DefaultGetById(w, r, &blogEntry, "Thumbnail")
}

func GetBlogEntryByTitle(w http.ResponseWriter, r *http.Request) {
	tenant, err := tenantFromParameter(w, r)
	if err != nil {
		return
	}
	var blogEntry *shtypes.BlogEntry
	title := r.URL.Query().Get("title")
	if title == "" {
		http.Error(w, "Missing title parameter", http.StatusBadRequest)
		return
	}
	blogEntry, err = repository.GetBlogEntryByName(tenant, title)
	if err != nil {
		http.NotFound(w, r)
		return
	}
	okResponse(w, blogEntry)
}

func SaveBlogEntry(w http.ResponseWriter, r *http.Request) {
	blogEntry, err := validatePublishable[*shtypes.BlogEntry](w, r)
	if err != nil {
		return
	}

	if blogEntry.Thumbnail != nil {
		blogEntry.ThumbnailID = &blogEntry.Thumbnail.ID //TODO.. ugly
	}

	if repository.SaveBlogEntry(blogEntry) != nil {
		internalServerErrorResponse(w, r, fmt.Sprintf("Could not save blogEntry: %v", blogEntry.ID))
	} else {
		logger.Saved(r, blogEntry.ID)
		okResponse(w, blogEntry)
	}
}

func DeleteBlogEntriesById(w http.ResponseWriter, r *http.Request) {
	DefaultDeleteByIds[*shtypes.BlogEntry](w, r, true)
}
