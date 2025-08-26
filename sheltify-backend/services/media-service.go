package services

import (
	"errors"
	"fmt"
	"io"
	"log"
	"mime/multipart"
	"os"
	"path/filepath"
	"sheltify-new-backend/repository"
	"sheltify-new-backend/shtypes"
	"strings"
	"sync"

	"gopkg.in/gographics/imagick.v3/imagick"
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
	defer storedFile.Close()

	_, err = storedFile.Write(fileBytes)
	if err != nil {
		return err
	}
	return nil
}

func DeleteMedia(id string) {
	DeleteUploadsWithPrefix(id)
	repository.DeleteMediaFileMeta(id)
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

func GetTenantsMediaFilesByTags(tags []string, tenant string) ([]shtypes.MediaFile, error) {
	return repository.GetTenantsMediaFilesByTags(tags, tenant)
}

var imageSizes = []struct {
	Label string
	Width uint
}{
	{"small", 320},
	{"medium", 640},
	{"large", 1280},
	{"xlarge", 1920},
}

func GenerateImageSizes(media *shtypes.MediaFile, thumbnailOnly bool) error {
	fmt.Println("Generating image sizes for media:", media.ID)
	mediaFilePath := filepath.Join("uploads", media.ID+filepath.Ext(media.OriginalFileName))

	if _, err := os.Stat(mediaFilePath); os.IsNotExist(err) {
		log.Fatalf("Error: File %s not found", mediaFilePath)
	}

	baseName := filepath.Base(mediaFilePath)
	ext := filepath.Ext(baseName)
	name := baseName[0 : len(baseName)-len(ext)]

	mw := imagick.NewMagickWand()
	err := mw.ReadImage(mediaFilePath)
	if err != nil {
		log.Fatalf("Failed to read input image: %v", err)
	}
	origWidth := mw.GetImageWidth()
	origHeight := mw.GetImageHeight()
	aspectRatio := float64(origHeight) / float64(origWidth)
	mw.Destroy()

	var sizes []struct {
		Label string
		Width uint
	}

	if thumbnailOnly {
		sizes = []struct {
			Label string
			Width uint
		}{{"thumbnail", 150}}
	} else {
		sizes = imageSizes
	}

	for _, size := range sizes {
		if origWidth >= size.Width {
			media.LargestAvailableSize = size.Label
		}
	}

	for _, size := range sizes {
		if origWidth < size.Width {
			continue
		}
		log.Printf("Processing %s: original width %d, target width %d\n", size.Label, origWidth, size.Width)
		if err := processImage(mediaFilePath, "uploads", name, size.Label, size.Width, aspectRatio); err != nil {
			log.Printf("Error processing %s: %v\n", size.Label, err)
		}
	}

	var wg sync.WaitGroup
	for _, size := range sizes {
		wg.Add(1)
		go func(label string, width uint) {
			defer wg.Done()
			if err := processImage(mediaFilePath, "uploads", name, label, width, aspectRatio); err != nil {
				log.Printf("Error processing %s: %v\n", label, err)
			}
		}(size.Label, size.Width)
	}

	err = repository.SetSizesGenerated(media)
	if err != nil {
		return err
	}
	if !thumbnailOnly {
		os.Remove(mediaFilePath)
	}
	fmt.Println("Image processing completed successfully.")
	return nil
}

func processImage(inputPath, outputDir, name, label string, width uint, aspectRatio float64) error {
	mw := imagick.NewMagickWand()
	defer mw.Destroy()

	// Read the input image
	err := mw.ReadImage(inputPath)
	if err != nil {
		return fmt.Errorf("failed to read image: %w", err)
	}

	height := uint(float64(width) * aspectRatio)

	err = mw.ResizeImage(width, height, imagick.FILTER_LANCZOS)
	if err != nil {
		return fmt.Errorf("failed to resize image to %s: %w", label, err)
	}

	// Set format to WebP
	mw.SetImageFormat("webp")
	mw.SetOption("webp:lossless", "false")
	mw.SetOption("webp:method", "6")
	mw.SetOption("webp:alpha-quality", "75")
	mw.SetImageCompressionQuality(92)

	outputPath := filepath.Join(outputDir, fmt.Sprintf("%s_%s.webp", name, label))
	err = mw.WriteImage(outputPath)
	if err != nil {
		return fmt.Errorf("failed to save %s image: %w", label, err)
	}

	fmt.Printf("Saved: %s\n", outputPath)
	return nil
}

func AddTagToMedia(mediaID string, tagNames []string) error {
	// Example implementation: Replace with actual database logic.
	mediaFile, err := repository.GetMediaFileMetaById(mediaID)
	if err != nil {
		return err
	}

	var tags []*shtypes.Tag
	for _, tagName := range tagNames {
		tag, _ := repository.GetTagByName(tagName)
		if tag == nil {
			repository.CreateTag(&shtypes.Tag{Name: tagName, TenantID: "mfg"})
			tags = append(tags, tag)
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

func SaveMedia(media *shtypes.MediaFile) {
	repository.SaveMedia(media)
}
