package services

import (
	"net/http"
	"os"
	"sheltify-new-backend/logger"
	"strings"

	htmlsanitizer "github.com/sym01/htmlsanitizer"
	gomail "gopkg.in/mail.v2"
)

var mailDialer *gomail.Dialer
var senderMail string

func InitMailDialer() {
	senderMail = os.Getenv("SMTP_SENDER")
	mailDialer = gomail.NewDialer("smtp.gmail.com", 587, senderMail, os.Getenv("SMTP_API_KEY"))
}

func SendMail(r *http.Request, recipients []string, replyTo string, subject string, htmlBody string) error {

sanitizedHTML, err := htmlsanitizer.SanitizeString(htmlBody)

if err != nil {
	return err
}

	htmlDocument := `<!DOCTYPE html><html lang="de"><head><meta charset="UTF-8"></head><body>` + sanitizedHTML + `</body></html>`

	message := gomail.NewMessage()
	message.SetHeader("From", senderMail)
	message.SetHeader("To", recipients...)
	message.SetHeader("Subject", subject)
	message.SetHeader("Reply-To", replyTo)
	message.SetHeader("Content-Language", "de")

	message.SetBody("text/html; charset=UTF-8", htmlDocument)

	if err := mailDialer.DialAndSend(message); err != nil {
		return err
	}
	logger.Info(r, "Email sent to " + strings.Join(recipients, ", "))
	return nil
}

