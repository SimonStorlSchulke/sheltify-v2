package shtypes

import (
	"fmt"
	"regexp"
	"slices"
)

func valMax(fieldName string, fieldValue int, maxLength int) string {
	if fieldValue > maxLength {
		return fmt.Sprintf("%s muss kleiner %v sein\n", fieldName, maxLength)
	}
	return ""
}

func valMin(fieldName string, fieldValue int, minLength int) string {
	if fieldValue < minLength {
		return fmt.Sprintf("%s muss größer %v sein\n", fieldName, minLength)
	}
	return ""
}

func valMinMax(fieldName string, fieldValue int, minLength int, maxLength int) string {
	if fieldValue < minLength || fieldValue > maxLength {
		return fmt.Sprintf("%s muss zwischen %v und %v liegen\n", fieldName, minLength, maxLength)
	}
	return ""
}

func valNotEmpty(fieldName string, fieldValue string) string {
	if len(fieldValue) < 1 {
		return fmt.Sprintf("%s kann nicht leer sein\n", fieldName)
	}
	return ""
}

func valMaxLength(fieldName string, fieldValue string, maxLength int) string {
	if len(fieldValue) > maxLength {
		return fmt.Sprintf("%s muss kürzer als %v Zeichen sein\n", fieldName, maxLength)
	}
	return ""
}

func valMinLength(fieldName string, fieldValue string, minLength int) string {
	if len(fieldValue) < minLength {
		return fmt.Sprintf("%s muss länger als %v Zeichen sein\n", fieldName, minLength)
	}
	return ""
}

func valMinMaxLength(fieldName string, fieldValue string, minLength int, maxLength int) string {
	if len(fieldValue) < minLength || len(fieldValue) > maxLength {
		return fmt.Sprintf("%s muss zwischen %v und %v Zeichen haben\n", fieldName, minLength, maxLength)
	}
	return ""
}

func valIsInList(fieldName string, fieldValue string, list []string) string {
	if !slices.Contains(list, fieldValue) {
		return fmt.Sprintf("%s muss einer folgender Werte sein: %v\n", fieldName, list)
	}
	return ""
}

func valMatchesRegex(fieldName string, fieldValue string, regex string, regexDescription string) string {
	matched, err := regexp.MatchString(regex, fieldValue)
	if err != nil || !matched {
		return fmt.Sprintf("%s %s\n", fieldName, regexDescription)
	}
	return ""
}

func valIsValidPath(fieldName string, fieldValue string) string {
	regex := `^/[a-zA-Z0-9/_-]*$`
	return valMatchesRegex(fieldName, fieldValue, regex, "muss eine gültige URL sein (muss mit / beginnen und nur Kleinbuchstaben, Zahlen, '-', '_' und '/' enthalten)")
}
