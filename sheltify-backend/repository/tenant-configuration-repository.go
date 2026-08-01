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
