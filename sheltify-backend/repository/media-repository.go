package repository

import (
	"fmt"
	"sheltify-new-backend/shtypes"
)

func CreateMediaFileMeta(media *shtypes.MediaFile) error {
	if err := db.Create(&media).Error; err != nil {
		return err
	}
	return nil
}

func GetMediaFileMetaById(id string) (*shtypes.MediaFile, error) {

	var mediaFile shtypes.MediaFile

	if err := db.Where("id = ?", id).First(&mediaFile).Error; err != nil {
		return nil, err
	}
	return &mediaFile, nil
}

func GetMediaFilesByTags(tags []string, tenant string) ([]shtypes.MediaFile, error) {
	var mediaFiles []shtypes.MediaFile
	var tagIds []string
	if err := db.Model(&shtypes.Tag{}).
		Where("name IN ?", tags).
		Pluck("id", &tagIds).Error; err != nil {
		return nil, err
	}

	if len(tagIds) != len(tags) {
		return nil, fmt.Errorf("one or more tags not found")
	}

	err := db.Preload("MediaTags").
		Preload("TaggedAnimals").
		Model(&shtypes.MediaFile{}).
		Joins("JOIN media_file_tags mft ON mft.media_file_id = media_files.id").
		Where("media_files.tenant_id = ?", tenant).
		Where("mft.tag_id IN ?", tagIds).
		Group("media_files.id").
		Find(&mediaFiles).Error

	if err != nil {
		return nil, err
	}

	return mediaFiles, nil
}

func GetMediaFilesByAnimalIds(animalIds []string, tenant string) ([]shtypes.MediaFile, error) {
	var mediaFiles []shtypes.MediaFile

	err := db.Preload("MediaTags").
		Preload("TaggedAnimals").
		Model(&shtypes.MediaFile{}).
		Joins("JOIN media_file_animals mfa ON mfa.media_file_id = media_files.id").
		Where("media_files.tenant_id = ?", tenant).
		Where("mfa.animal_id IN ?", animalIds).
		Group("media_files.id").
		Find(&mediaFiles).Error

	if err != nil {
		return nil, err
	}

	return mediaFiles, nil
}

func GetAllTenantsMedia(tenant string) ([]shtypes.MediaFile, error) {
	var mediaFiles []shtypes.MediaFile

	//TODO loading the full animal here is kinda overkill, we just need the IDs
	err := db.Preload("MediaTags").Preload("TaggedAnimals").Find(&mediaFiles).
		Where("media_files.tenant_id = ?", tenant).
		Find(&mediaFiles).Error

	if err != nil {
		return nil, err
	}

	return mediaFiles, nil
}

func DeleteMediaFileMeta(id string) error {
	if err := db.Unscoped().Where("id = ?", id).Delete(&shtypes.MediaFile{}).Error; err != nil {
		return err
	}
	return nil
}

func SetSizesGenerated(media *shtypes.MediaFile) error {
	media.SizesGenerated = true
	if err := db.Save(&media).Error; err != nil {
		return err
	}
	return nil
}

func CreateTag(tag *shtypes.Tag) error {
	if err := db.Create(&tag).Error; err != nil {
		return err
	}
	return nil
}

func DeleteTag(id string, tenant string) error {
	if err := db.Unscoped().Where("id = ? AND tenant_id = ?", id, tenant).Delete(&shtypes.Tag{}).Error; err != nil {
		return err
	}
	return nil
}

func GetAllTags(tenant string) ([]shtypes.Tag, error) {
	var tags []shtypes.Tag
	if err := db.Where("tenant_id = ?", tenant).Find(&tags).Error; err != nil {
		return nil, err
	}
	return tags, nil
}

func GetTagByName(name string, tenant string) (*shtypes.Tag, error) {
	var tag shtypes.Tag
	if err := db.Where("name = ? AND tenant_id = ?", name, tenant).First(&tag).Error; err != nil {
		return nil, err
	}
	return &tag, nil
}

func SaveMedia(media *shtypes.MediaFile) error {
	if err := db.Save(media).Error; err != nil {
		return err
	}
	if err := db.Model(media).Association("MediaTags").Replace(media.MediaTags); err != nil {
		return err
	}
	if err := db.Model(media).Association("TaggedAnimals").Replace(media.TaggedAnimals); err != nil {
		return err
	}
	return nil
}
