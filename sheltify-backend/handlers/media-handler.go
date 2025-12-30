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

func GetMediaByTags(w http.ResponseWriter, r *http.Request) {
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
		medias, err = repository.GetMediaFilesByTags(tags, tenant)
	}
	if err != nil {
		//TODO - throws if multiple tags with same name exist (which shouldn't be possible in the first place)
		internalServerErrorResponse(w, r, err.Error())
		return
	}
	okResponse(w, medias)
}

func GetMediaByIds(w http.ResponseWriter, r *http.Request) {
	var medias []shtypes.MediaFile
	DefaultGetByIds(w, r, &medias)
}

func GetMediaByAnimalIDs(w http.ResponseWriter, r *http.Request) {
	tenant, err := tenantFromParameter(w, r)
	if err != nil {
		return
	}
	animalIdsString := r.URL.Query().Get("animalIds")

	var medias []shtypes.MediaFile
	if animalIdsString == "" {
		medias, err = repository.GetAllTenantsMedia(tenant)
	} else {
		animalIds := strings.Split(animalIdsString, ",")
		medias, err = repository.GetMediaFilesByAnimalIds(animalIds, tenant)
	}
	if err != nil {
		internalServerErrorResponse(w, r, err.Error())
		return
	}
	okResponse(w, medias)
}

func AddAnimalsToMedia(w http.ResponseWriter, r *http.Request) {
	mediaId := chi.URLParam(r, "mediaId")
	animalIds := r.URL.Query().Get("animalIds")

	if mediaId == "" || animalIds == "" {
		badRequestResponse(w, r, "mediaId and animalIds must be provided")
		return
	}

	user := services.UserFromRequest(r)

	err := services.AddAnimalsToMedia(mediaId, strings.Split(animalIds, ","), user.TenantID)

	if err != nil {
		internalServerErrorResponse(w, r, fmt.Sprintf("Could not add animals to media: %v", err))
		return
	}

	emptyOkResponse(w)
}

func UploadFiles(w http.ResponseWriter, r *http.Request) {
	// upload 50 MB max
	r.ParseMultipartForm(50 << 20)

	user := services.UserFromRequest(r)

	uploadedFiles := []multipart.File{}

	uuid := uuid.NewString()

	entity := shtypes.MediaFile{
		NonImage:         true,
		OriginalFileName: r.FormValue("FileName"),
		Title:            r.FormValue("Title"),
		Description:      r.FormValue("Description"),
		FocusX:           0.5,
		FocusY:           0.5,
	}

	entity.ID = uuid
	entity.TenantID = r.FormValue("TenantID")

	//for _, sizeLabel := range sizeNames {
	uploadedFile, _, err := r.FormFile("File")
	if err == nil {
		uploadedFiles = append(uploadedFiles, uploadedFile)
		fmt.Println("Uploaded file")
		entity.LargestAvailableSize = "original"
		defer uploadedFile.Close()
	}
	//}

	errMessage := entity.Validate()
	if errMessage != "" {
		badRequestResponse(w, r, errMessage)
		return
	}

	err = repository.CreateMediaFileMeta(&entity)
	if err != nil {
		internalServerErrorResponse(w, r, "Failed to store Metadata")
		return
	}

	tagsStr := r.FormValue("Tags")
	fmt.Println("Tags received:", tagsStr)

	fmt.Println("Tags received:", tagsStr)
	if tagsStr != "" {
		tags := strings.Split(tagsStr, ",")
		services.AddTagToMedia(uuid, tags, user.TenantID)
	}

	animalIDsStr := r.FormValue("AnimalIDs")
	if animalIDsStr != "" {
		animalIDs := strings.Split(animalIDsStr, ",")
		services.AddAnimalsToMedia(uuid, animalIDs, user.TenantID)
	}

	for _, uploadedFile := range uploadedFiles {

		filename := uuid
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

func UploadScaledWebps(w http.ResponseWriter, r *http.Request) {

	// upload 50 MB max
	r.ParseMultipartForm(50 << 20)

	user := services.UserFromRequest(r)

	uploadedFiles := []multipart.File{}

	sizeNames := []string{"thumbnail", "small", "medium", "large", "xlarge"}

	uuid := uuid.NewString() //TODO can I avoid doing this manually here?

	focusX, err1 := strconv.ParseFloat(r.FormValue("FocusX"), 32)
	focusY, err2 := strconv.ParseFloat(r.FormValue("FocusY"), 32)

	entity := shtypes.MediaFile{
		NonImage:         false,
		OriginalFileName: r.FormValue("FileName"),
		Title:            r.FormValue("Title"),
		Description:      r.FormValue("Description"),
		FocusX:           float32(focusX),
		FocusY:           float32(focusY),
	}

	entity.ID = uuid
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

	fmt.Println("Tags received:", tagsStr)
	if tagsStr != "" {
		tags := strings.Split(tagsStr, ",")
		services.AddTagToMedia(uuid, tags, user.TenantID)
	}

	animalIDsStr := r.FormValue("AnimalIDs")
	if animalIDsStr != "" {
		animalIDs := strings.Split(animalIDsStr, ",")
		services.AddAnimalsToMedia(uuid, animalIDs, user.TenantID)
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
	tenant, err := tenantFromParameter(w, r)

	if err != nil {
		return
	}

	tags, err := repository.GetAllTags(tenant)
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

func SaveMedia(w http.ResponseWriter, r *http.Request) {
	media, err := validateRequestBody[*shtypes.MediaFile](w, r)
	if err != nil {
		return
	}

	user := services.UserFromRequest(r)

	for _, tag := range media.MediaTags {
		tagEntity, _ := repository.GetTagByName(tag.Name, user.TenantID)
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
