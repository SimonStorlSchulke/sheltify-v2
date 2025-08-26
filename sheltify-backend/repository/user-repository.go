package repository

import "sheltify-new-backend/shtypes"

func GetUser(id string) (*shtypes.User, error) {
	var user shtypes.User
	if err := db.Where("id = ?", id).First(&user).Error; err != nil {
		return nil, err
	}
	return &user, nil
}

func CreateUser(id string, hasedPassword string) (*shtypes.User, error) {
	user := shtypes.User{ID: id, HashedPassword: hasedPassword}

	if err := db.Create(&user).Error; err != nil {
		return nil, err
	}
	return &user, nil
}

func SaveUser(user *shtypes.User) error {
	if err := db.Save(&user).Error; err != nil {
		return err
	}
	return nil
}
