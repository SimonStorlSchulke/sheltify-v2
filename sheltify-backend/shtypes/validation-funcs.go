package shtypes

import (
	"fmt"
	"slices"
)

func valMax(fieldName string, fieldValue int, maxLength int) string {
	if fieldValue > maxLength {
		return fmt.Sprintf("%s must be less than %v\n", fieldName, maxLength)
	}
	return ""
}

func valMin(fieldName string, fieldValue int, minLength int) string {
	if fieldValue < minLength {
		return fmt.Sprintf("%s must be greater than %v\n", fieldName, minLength)
	}
	return ""
}

func valMinMax(fieldName string, fieldValue int, minLength int, maxLength int) string {
	if fieldValue < minLength || fieldValue > maxLength {
		return fmt.Sprintf("%s must be between %v and %v\n", fieldName, minLength, maxLength)
	}
	return ""
}

func valNotEmpty(fieldName string, fieldValue string) string {
	if len(fieldValue) < 1 {
		return fmt.Sprintf("%s cannot be empty\n", fieldName)
	}
	return ""
}

func valMaxLength(fieldName string, fieldValue string, maxLength int) string {
	if len(fieldValue) > maxLength {
		return fmt.Sprintf("%s must be shorter than %v characters\n", fieldName, maxLength)
	}
	return ""
}

func valMinLength(fieldName string, fieldValue string, minLength int) string {
	if len(fieldValue) < minLength {
		return fmt.Sprintf("%s must be longer than %v characters\n", fieldName, minLength)
	}
	return ""
}

func valMinMaxLength(fieldName string, fieldValue string, minLength int, maxLength int) string {
	if len(fieldValue) < minLength || len(fieldValue) > maxLength {
		return fmt.Sprintf("%s must be between %v and %v characters\n", fieldName, minLength, maxLength)
	}
	return ""
}

func valIsInList(fieldName string, fieldValue string, list []string) string {
	if !slices.Contains(list, fieldValue) {
		return fmt.Sprintf("%s must be one of the following: %v\n", fieldName, list)
	}
	return ""
}
