package handlers

import (
	"fmt"
	"mime/multipart"
	"net/http"
	"path/filepath"
	"sheltify-new-backend/logger"
	"sheltify-new-backend/repository"
	"sheltify-new-backend/services"
	"sheltify-new-backend/shtypes"
	"strconv"
	"strings"

	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"
)

func GetTenantsMediaByTags(w http.ResponseWriter, r *http.Request) {
	tenant, err := tenantFromParameter(w, r)
	if err != nil {
		return
	}
	tagsString := r.URL.Query().Get("tags")

	var medias []shtypes.MediaFile
	if tagsString == "" {
		medias, err = repository.GetAllTenantsMedia(tenant)
	} else {
		tags := strings.Split(tagsString, ",")
		medias, err = repository.GetTenantsMediaFilesByTags(tags, tenant)
	}
	if err != nil {
		//TODO - throws if multiple tags with same name exist (which shouldn't be possible in the first place)
		internalServerErrorResponse(w, r, err.Error())
		return
	}
	okResponse(w, medias)
}

func UploadScaledWebps(w http.ResponseWriter, r *http.Request) {

	// upload 50 MB max
	r.ParseMultipartForm(50 << 20)

	user := services.UserFromRequest(r)

	uploadedFiles := []multipart.File{}

	sizeNames := []string{"thumbnail", "small", "medium", "large", "xlarge"}

	uuid := uuid.NewString()

	focusX, err1 := strconv.ParseFloat(r.FormValue("FocusX"), 32)
	focusY, err2 := strconv.ParseFloat(r.FormValue("FocusY"), 32)

	entity := shtypes.MediaFile{
		ID:               uuid,
		OriginalFileName: r.FormValue("FileName"),
		Title:            r.FormValue("Title"),
		Description:      r.FormValue("Description"),
		FocusX:           float32(focusX),
		FocusY:           float32(focusY),
	}

	entity.TenantID = r.FormValue("TenantID")

	for _, sizeLabel := range sizeNames {
		uploadedFile, _, err := r.FormFile(sizeLabel)
		if err == nil {
			uploadedFiles = append(uploadedFiles, uploadedFile)
			fmt.Println("Uploaded file for size:", sizeLabel)
			entity.LargestAvailableSize = sizeLabel
			defer uploadedFile.Close()
		}
	}

	if err1 != nil || err2 != nil {
		badRequestResponse(w, r, "FocusX and FocusY must be numbers")
		return
	}

	errMessage := entity.Validate()
	if errMessage != "" {
		badRequestResponse(w, r, errMessage)
		return
	}

	err := repository.CreateMediaFileMeta(&entity)
	if err != nil {
		internalServerErrorResponse(w, r, "Failed to store Metadata")
		return
	}

	tagsStr := r.FormValue("Tags")
	fmt.Println("Tags received:", tagsStr)
	if tagsStr != "" {
		tags := strings.Split(tagsStr, ",")
		services.AddTagToMedia(uuid, tags, user.TenantID)
	}

	for i, uploadedFile := range uploadedFiles {

		filename := uuid + "_" + sizeNames[i] + ".webp"
		savePath := filepath.Join("uploads", filename)
		fmt.Println(savePath)

		err = services.StoreMultiPartFile(uploadedFile, savePath)
		if err != nil {
			internalServerErrorResponse(w, r, err.Error())
			repository.DeleteMediaFileMeta(uuid)
			return
		}
	}
	logger.Created(r, uuid)
	createdResponse(w, entity)
}

func DeleteMedia(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")

	if id == "" {
		badRequestResponse(w, r, "media id must be provided")
		return
	}
	logger.Deleted(r, id)
	services.DeleteMedia(id)
}

func GetAllTags(w http.ResponseWriter, r *http.Request) {
	tags, err := repository.GetAllTags()
	if err != nil {
		internalServerErrorResponse(w, r, "Could not retrieve tags")
		return
	}
	okResponse(w, tags)
}

func CreateTag(w http.ResponseWriter, r *http.Request) {
	tag, err := validateRequestBody[*shtypes.Tag](w, r)
	if err != nil {
		return
	}
	if repository.CreateTag(tag) != nil {
		internalServerErrorResponse(w, r, "Could not create mediatag")
	} else {
		logger.Saved(r, tag.Name)
		createdResponse(w, tag)
	}
}

func DeleteTag(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	user := services.UserFromRequest(r)

	if id == "" {
		badRequestResponse(w, r, "tag id must be provided")
		return
	}

	if err := repository.DeleteTag(id, user.TenantID); err != nil {
		logger.RequestError(r, id, err)
		internalServerErrorResponse(w, r, "Could not delete tag")
	} else {
		logger.Deleted(r, id)
		emptyOkResponse(w)
	}
}

type AddTagToMediaRequest struct {
	MediaId  string
	TagNames []string
}

func SaveMedia(w http.ResponseWriter, r *http.Request) {
	media, err := validateRequestBody[*shtypes.MediaFile](w, r)
	if err != nil {
		return
	}

	user := services.UserFromRequest(r)

	for _, tag := range media.MediaTags {
		tagEntity, _ := repository.GetTagByName(tag.Name)
		if tagEntity == nil {
			tag := shtypes.Tag{Name: tag.Name}
			tag.TenantID = user.TenantID
			repository.CreateTag(&tag)
		}
	}

	if repository.SaveMedia(media) != nil {
		internalServerErrorResponse(w, r, "Could not update media")
	} else {
		logger.Saved(r, media.ID)
		okResponse(w, media)
	}
}
