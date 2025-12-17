package handlers

import (
	"fmt"
	"net/http"
	"sheltify-new-backend/logger"
	"sheltify-new-backend/repository"
	"sheltify-new-backend/shtypes"
)

func GetBlogEntries(w http.ResponseWriter, r *http.Request) {
	var blogEntries []*shtypes.BlogEntry
	DefaultGetAll(w, r, &blogEntries)
}

func GetBlogEntryById(w http.ResponseWriter, r *http.Request) {
	var blogEntry *shtypes.BlogEntry
	DefaultGetById(w, r, &blogEntry, "Thumbnail")
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
