package repository

import "sheltify-new-backend/shtypes"

func GetConfigByTenantId(tenantId string) (*shtypes.TenantConfiguration, error) {
	var config shtypes.TenantConfiguration
	if err := db.Preload("LogoHeader").Where("tenant_id = ?", tenantId).First(&config).Error; err != nil {
		return nil, err
	}
	return &config, nil
}

func SaveTenantConfiguration(config *shtypes.TenantConfiguration) error {
	if err := db.Save(&config).Error; err != nil {
		return err
	}
	return nil
}
