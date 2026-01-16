package handlers

import (
	"net/http"
	"sort"
	"strings"

	"sheltify-new-backend/repository"
	"sheltify-new-backend/services"
	"sheltify-new-backend/shtypes"
)

func FormSubmit(w http.ResponseWriter, r *http.Request) {

	tenant, err := tenantFromParameter(w, r)
	if err != nil {
		badRequestResponse(w, r, "TenantID could not be determined from path")
		return
	}

	formSubmission, err := parseRequestBody[*shtypes.FormSubmission](w, r)
	if err != nil {
		return
	}

	formSubmission.SetTenantId(tenant)

	err = repository.SaveFormSubmission(formSubmission)
	if err != nil {
		internalServerErrorResponse(w, r, err.Error())
		return
	}
	recipients := strings.Split(formSubmission.SentTo, ",")
	err = services.SendMail(r,  recipients, formSubmission.SenderMail, formSubmission.Type, formSubmission.Text)
	if err != nil {
		internalServerErrorResponse(w, r, "Failed to forward mail")
		return
	}
	emptyOkResponse(w)
}

func GetFormById(w http.ResponseWriter, r *http.Request) {
	var form *shtypes.FormSubmission
	user := services.UserFromRequest(r)

	id, err := idFromParameter(w, r)
	if err != nil {
		return
	}
	if err := repository.DefaultGetByID(id, user.TenantID, &form); err != nil {
		http.NotFound(w, r)
		return
	}
	okResponse(w, form)
}

func GetSubmittedForms(w http.ResponseWriter, r *http.Request) {
	user := services.UserFromRequest(r)
	tenant := user.TenantID

	forms, err := repository.GetFormSubmissionsByTenant(tenant)
	if err != nil {
		internalServerErrorResponse(w, r, err.Error())
		return
	}
	sort.Slice(forms, func(i, j int) bool {
		return forms[i].CreatedAt.After(forms[j].CreatedAt)
	})
	okResponse(w, forms)
}

func DeleteFormByIds(w http.ResponseWriter, r *http.Request) {
	DefaultDeleteByIds[*shtypes.FormSubmission](w, r, false)
}