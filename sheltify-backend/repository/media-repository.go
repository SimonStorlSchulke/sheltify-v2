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
	var tagIds []uint
	if err := db.Model(&shtypes.Tag{}).
		Where("name IN ?", tags).
		Pluck("id", &tagIds).Error; err != nil {
		return nil, err
	}

	if len(tagIds) != len(tags) {
		return nil, fmt.Errorf("one or more tags not found")
	}

	err := db.Preload("MediaTags").
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

func GetAllTenantsMedia(tenant string) ([]shtypes.MediaFile, error) {
	var mediaFiles []shtypes.MediaFile

	err := db.Preload("MediaTags").Find(&mediaFiles).
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

func DeleteTag(id string, tenantId string) error {
	if err := db.Unscoped().Where("id = ? AND tenant_id = ?", id, tenantId).Delete(&shtypes.Tag{}).Error; err != nil {
		return err
	}
	return nil
}

func GetAllTags() ([]shtypes.Tag, error) {
	var tags []shtypes.Tag
	if err := db.Find(&tags).Error; err != nil {
		return nil, err
	}
	return tags, nil
}

func GetTagByName(name string) (*shtypes.Tag, error) {
	var tag shtypes.Tag
	if err := db.Where("name = ?", name).First(&tag).Error; err != nil {
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
	return nil
}
