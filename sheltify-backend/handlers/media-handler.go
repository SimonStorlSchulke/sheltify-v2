package handlers

import (
	"fmt"
	"log"
	"mime/multipart"
	"net/http"
	"path/filepath"
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
		internalServerErrorResponse(w, err.Error())
		return
	}
	okResponse(w, medias)
}

func UploadMedia(w http.ResponseWriter, r *http.Request) {

	// upload 25 MB max
	r.ParseMultipartForm(25 << 20)
	uploadedFile, handler, err := r.FormFile("file")
	if err != nil {
		internalServerErrorResponse(w, err.Error())
		return
	}
	defer uploadedFile.Close()

	uuid := uuid.NewString()
	extension := filepath.Ext(handler.Filename)
	filename := uuid + extension
	savePath := filepath.Join("uploads", filename)

	focusX, err1 := strconv.ParseFloat(r.FormValue("FocusX"), 32)
	focusY, err2 := strconv.ParseFloat(r.FormValue("FocusY"), 32)

	if err1 != nil || err2 != nil {
		badRequestResponse(w, "FocusX and FocusY must be numbers")
		return
	}

	entity := shtypes.MediaFile{
		ID:               uuid,
		OriginalFileName: handler.Filename,
		Title:            r.FormValue("Title"),
		Description:      r.FormValue("Description"),
		FocusX:           float32(focusX),
		FocusY:           float32(focusY),
		TenantID:         r.FormValue("TenantID"),
	}

	errMessage := entity.Validate()
	if errMessage != "" {
		badRequestResponse(w, errMessage)
		return
	}

	err = repository.CreateMediaFileMeta(&entity)
	if err != nil {
		internalServerErrorResponse(w, "Failed to store Metadata")
		return
	}

	err = services.StoreMultiPartFile(uploadedFile, savePath)
	if err != nil {
		internalServerErrorResponse(w, err.Error())
		repository.DeleteMediaFileMeta(uuid)
		return
	}

	//
	if err := services.GenerateImageSizes(&entity, true); err != nil {
		log.Printf("failed to generate thumbnail for %s: %v", entity.ID, err)
	}

	createdResponse(w, entity)

	go func(ent shtypes.MediaFile) {
		defer func() {
			if r := recover(); r != nil {
				log.Printf("panic in GenerateImageSizes: %v", r)
			}
		}()
		if err := services.GenerateImageSizes(&ent, false); err != nil {
			log.Printf("failed to generate image sizes for %s: %v", ent.ID, err)
		}
	}(entity)
}

func UploadScaledWebps(w http.ResponseWriter, r *http.Request) {

	// upload 50 MB max
	r.ParseMultipartForm(50 << 20)

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
		TenantID:         r.FormValue("TenantID"),
	}

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
		badRequestResponse(w, "FocusX and FocusY must be numbers")
		return
	}

	errMessage := entity.Validate()
	if errMessage != "" {
		badRequestResponse(w, errMessage)
		return
	}

	err := repository.CreateMediaFileMeta(&entity)
	if err != nil {
		internalServerErrorResponse(w, "Failed to store Metadata")
		return
	}

	tagsStr := r.FormValue("Tags")
	fmt.Println("Tags received:", tagsStr)
	if tagsStr != "" {
		tags := strings.Split(tagsStr, ",")
		services.AddTagToMedia(uuid, tags)
	}

	for i, uploadedFile := range uploadedFiles {

		filename := uuid + "_" + sizeNames[i] + ".webp"
		savePath := filepath.Join("uploads", filename)
		fmt.Println(savePath)

		err = services.StoreMultiPartFile(uploadedFile, savePath)
		if err != nil {
			internalServerErrorResponse(w, err.Error())
			repository.DeleteMediaFileMeta(uuid)
			return
		}
	}

	createdResponse(w, entity)
}

func DeleteMedia(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")

	if id == "" {
		badRequestResponse(w, "media id must be provided")
		return
	}
	services.DeleteMedia(id)
}

func GetAllTags(w http.ResponseWriter, r *http.Request) {
	tags, err := repository.GetAllTags()
	if err != nil {
		internalServerErrorResponse(w, "Could not retrieve tags")
		return
	}
	okResponse(w, tags)
}

func CreateTag(w http.ResponseWriter, r *http.Request) {
	tag := validateRequestBody[*shtypes.Tag](w, r)
	if repository.CreateTag(tag) != nil {
		internalServerErrorResponse(w, "Could not create mediatag")
	} else {
		createdResponse(w, tag)
	}
}

func DeleteTag(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	user := services.UserFromContext(r)

	if id == "" {
		badRequestResponse(w, "tag id must be provided")
		return
	}

	if err := repository.DeleteTag(id, *user.TenantID); err != nil {
		internalServerErrorResponse(w, "Could not delete tag")
	} else {
		emptyOkResponse(w)
	}
}

type AddTagToMediaRequest struct {
	MediaId  string
	TagNames []string
}

func AddTagToMedia(w http.ResponseWriter, r *http.Request) {
	request := parseRequestBody[AddTagToMediaRequest](w, r)
	if request == nil {
		return
	}

	if services.AddTagToMedia(request.MediaId, request.TagNames) != nil {
		internalServerErrorResponse(w, "Could not add mediatag to media")
	} else {
		emptyOkResponse(w)
	}
}

func SaveMedia(w http.ResponseWriter, r *http.Request) {
	media := validateRequestBody[*shtypes.MediaFile](w, r)

	if media == nil {
		return
	}

	for _, tag := range media.MediaTags {
		tagEntity, _ := repository.GetTagByName(tag.Name)
		if tagEntity == nil {
			repository.CreateTag(&shtypes.Tag{Name: tag.Name, TenantID: "mfg"})
		}
	}

	if repository.SaveMedia(media) != nil {
		internalServerErrorResponse(w, "Could not update media")
	} else {
		okResponse(w, media)
	}
}
