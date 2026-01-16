package shtypes

type FormSubmission struct {
	CmsType
	Type       string
	SenderMail string
	Text       string
	SentTo     string
}
