package repository

import "sheltify-new-backend/shtypes"

func GetUserByName(name string) (*shtypes.User, error) {
	var user shtypes.User
	if err := db.Where("name = ?", name).First(&user).Error; err != nil {
		return nil, err
	}
	return &user, nil
}

func CreateUser(userName string, email string, hasedPassword string, tenant string) (*shtypes.User, error) {
	user := shtypes.User{
		Name:           userName,
		HashedPassword: hasedPassword,
		Email:          email,
	}
	user.SetTenantId(tenant)

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

func UserAlreadyExistsForTenantAndEmail(email string, tenant string) (bool, error) {
	var count int64

	err := db.Model(&shtypes.User{}).
		Where("email = ? AND tenant_id = ?", email, tenant).
		Count(&count).Error
	if err != nil {
		return false, err
	}

	return count > 0, nil
}
