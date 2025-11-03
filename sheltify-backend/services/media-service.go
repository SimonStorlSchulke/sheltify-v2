package services

import (
	"errors"
	"fmt"
	"image"
	_ "image/gif" // Register GIF decoder
	"image/jpeg"
	"io"
	"log"
	"mime/multipart"
	"os"
	"path/filepath"
	"sheltify-new-backend/repository"
	"sheltify-new-backend/shtypes"
	"strings"
	"sync"

	"golang.org/x/image/draw"
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

	file, err := os.Open(mediaFilePath)
	if err != nil {
		return fmt.Errorf("failed to open image: %w", err)
	}
	defer file.Close()

	srcImg, format, err := image.Decode(file)
	if err != nil {
		return fmt.Errorf("failed to decode image: %w", err)
	}

	bounds := srcImg.Bounds()
	origWidth := bounds.Dx()
	origHeight := bounds.Dy()
	aspectRatio := float64(origHeight) / float64(origWidth)

	baseName := filepath.Base(mediaFilePath)
	ext := filepath.Ext(baseName)
	name := baseName[0 : len(baseName)-len(ext)]

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
		if origWidth >= int(size.Width) {
			media.LargestAvailableSize = size.Label
		}
	}

	var wg sync.WaitGroup
	for _, size := range sizes {
		if origWidth < int(size.Width) {
			continue
		}

		wg.Add(1)
		go func(label string, width uint) {
			defer wg.Done()
			if err := processImageStandard(srcImg, format, "uploads", name, label, width, aspectRatio); err != nil {
				log.Printf("Error processing %s: %v\n", label, err)
			}
		}(size.Label, size.Width)
	}

	wg.Wait()

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

func processImageStandard(src image.Image, format, outputDir, name, label string, width uint, aspectRatio float64) error {
	height := int(float64(width) * aspectRatio)
	dst := image.NewRGBA(image.Rect(0, 0, int(width), height))

	// Use high-quality resampling from the Go standard x/image/draw package
	draw.CatmullRom.Scale(dst, dst.Bounds(), src, src.Bounds(), draw.Over, nil)

	outputPath := filepath.Join(outputDir, fmt.Sprintf("%s_%s.jpg", name, label))
	outFile, err := os.Create(outputPath)
	if err != nil {
		return fmt.Errorf("failed to create output file: %w", err)
	}
	defer outFile.Close()

	// Always save as JPEG
	opts := jpeg.Options{Quality: 92}
	err = jpeg.Encode(outFile, dst, &opts)
	if err != nil {
		return fmt.Errorf("failed to encode %s image: %w", label, err)
	}

	fmt.Printf("Saved: %s\n", outputPath)
	return nil
}

func AddTagToMedia(mediaID string, tagNames []string) error {
	mediaFile, err := repository.GetMediaFileMetaById(mediaID)
	if err != nil {
		return err
	}

	var tags []*shtypes.Tag
	for _, tagName := range tagNames {
		tag, _ := repository.GetTagByName(tagName)
		if tag == nil {
			newTag := &shtypes.Tag{Name: tagName, TenantID: "mfg"}
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

func SaveMedia(media *shtypes.MediaFile) {
	repository.SaveMedia(media)
}
