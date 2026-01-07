package services

import (
	"errors"
	"fmt"
	"io"
	"mime/multipart"
	"os"
	"path/filepath"
	"sheltify-new-backend/repository"
	"sheltify-new-backend/shtypes"
	"strings"
)

func StoreMultiPartFile(multiPartFile multipart.File, savePath string) error {
	fileBytes, err := io.ReadAll(multiPartFile)
	if err != nil {
		return err
	}

	err = os.MkdirAll("uploads", os.ModePerm)
	if err != nil {
		return err
	}

	storedFile, err := os.Create(savePath)
	if err != nil {
		return err
	}
	defer storedFile.Close()

	_, err = storedFile.Write(fileBytes)
	return err
}

func DeleteMedia(id string) error {
	err := repository.DeleteMediaFileMeta(id)
	if err == nil {
		DeleteUploadsWithPrefix(id)
	}
	return err
}

func DeleteUploadsWithPrefix(prefix string) error {
	files, err := os.ReadDir("uploads")
	if err != nil {
		return fmt.Errorf("failed to read directory: %w", err)
	}

	for _, file := range files {
		if strings.HasPrefix(file.Name(), prefix) {
			filePath := filepath.Join("uploads", file.Name())
			if err := os.Remove(filePath); err != nil {
				fmt.Printf("failed to delete file %s: %v\n", filePath, err)
			} else {
				fmt.Printf("deleted file: %s\n", filePath)
			}
		}
	}
	return nil
}

func GetMediaFilesByTags(tags []string, tenant string) ([]shtypes.MediaFile, error) {
	return repository.GetMediaFilesByTags(tags, tenant)
}

func AddTagToMedia(mediaID string, tagNames []string, tenant string) error {
	mediaFile, err := repository.GetMediaFileMetaById(mediaID)
	if err != nil {
		return err
	}

	var tags []*shtypes.Tag
	for _, tagName := range tagNames {
		tag, _ := repository.GetTagByName(tagName, tenant)
		if tag == nil {
			newTag := &shtypes.Tag{Name: tagName}
			newTag.TenantID = tenant
			repository.CreateTag(newTag)
			tags = append(tags, newTag)
		} else {
			tags = append(tags, tag)
		}
	}

	mediaFile.MediaTags = append(mediaFile.MediaTags, tags...)

	err = repository.SaveMedia(mediaFile)
	if err != nil {
		return errors.New("failed to update media file with new tag")
	}

	return nil
}

func AddAnimalsToMedia(mediaID string, animalIds []string, tenant string) error {
	mediaFile, err := repository.GetMediaFileMetaById(mediaID)
	if err != nil {
		return err
	}

	var animals []shtypes.Animal
	err = repository.DefaultGetByIDs(animalIds, tenant, &animals)
	if err != nil {
		return err
	}

	for i := range animals {
		mediaFile.TaggedAnimals = append(mediaFile.TaggedAnimals, &animals[i])
	}

	err = repository.SaveMedia(mediaFile)
	if err != nil {
		return errors.New("failed to update media file with new tag")
	}

	return nil
}

func SaveMedia(media *shtypes.MediaFile) {
	repository.SaveMedia(media)
}
