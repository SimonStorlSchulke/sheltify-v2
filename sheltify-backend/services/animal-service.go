package services

import "sheltify-new-backend/repository"

func SetAnimalPortrait(animalId int, portraitId string) error {
	animal, err := repository.GetAnimal(animalId)
	if err != nil {
		return err
	}

	media, err := repository.GetMediaFileMetaById(portraitId)
	if err != nil {
		return err
	}

	animal.Portrait = media

	if err := repository.SaveAnimal(animal); err != nil {
		return err
	}
	return nil
}
