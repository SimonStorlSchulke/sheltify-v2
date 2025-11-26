package handlers

import (
	"fmt"
	"net/http"
	"sheltify-new-backend/logger"
	"sheltify-new-backend/repository"
	"sheltify-new-backend/shtypes"
)

func GetArticle(w http.ResponseWriter, r *http.Request) {
	id, err := idFromParameter(w, r)
	if err != nil {
		return
	}

	article, err := repository.GetArticleById(id)

	if err != nil {
		http.NotFound(w, r)
		return
	}

	okResponse(w, article)
}

func SaveArticle(w http.ResponseWriter, r *http.Request) {
	article, err := validateRequestBody[*shtypes.Article](w, r)
	if err != nil {
		return
	}

	if repository.SaveArticle(article) != nil {
		internalServerErrorResponse(w, r, fmt.Sprintf("Could not save article: %v", article.ID))
	} else {
		logger.Saved(r, article.ID)
		okResponse(w, article)
	}
}

func GetArticleSectionByTypeAndId(w http.ResponseWriter, r *http.Request) {
	id, err := idFromParameter(w, r)
	if err != nil {
		return
	}

	sectionType := r.URL.Query().Get("sectionType")
	section, err := repository.GetArticleSectionByTypeAndId(sectionType, id)

	if err != nil {
		http.NotFound(w, r)
		return
	} else {
		okResponse(w, section)
	}
}

/* func SaveArticleSectionByType(w http.ResponseWriter, r *http.Request) {

	sectionType := r.URL.Query().Get("sectionType")

	articleSection, err := validateRequestBody[*shtypes.SectionText](w, r)
	if err != nil {
		return
	}

	sectionType := r.URL.Query().Get("sectionType")
	section, err := repository.SaveArticleSectionByType(sectionType, id)

	if err != nil {
		http.NotFound(w, r)
		return
	} else {
		logger.Saved(r, section.ID)
		okResponse(w, section)
	}
} */
