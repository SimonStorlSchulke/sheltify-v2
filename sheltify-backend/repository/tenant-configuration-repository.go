package repository

import "sheltify-backend/shtypes"

func CreateTenant(id string) (*shtypes.Tenant, error) {
	var tenant shtypes.Tenant
	tenant.ID = id
	if err := db.Create(&tenant).Error; err != nil {
		return nil, err
	}
	return &tenant, nil
}

func GetAllTenantConfigurations() ([]shtypes.TenantConfiguration, error) {
	configs := []shtypes.TenantConfiguration{}
	if err := db.Order("tenant_id").Find(&configs).Error; err != nil {
		return nil, err
	}
	return configs, nil
}

func GetConfigByTenantId(tenantId string) (*shtypes.TenantConfiguration, error) {
	var config shtypes.TenantConfiguration
	if err := db.Preload("LogoHeader").Preload("LogoSmall").Preload("Favicon").Where("tenant_id = ?", tenantId).First(&config).Error; err != nil {
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
