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
