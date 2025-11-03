package repository

import (
	"fmt"
	"log"
	"os"
	"sheltify-new-backend/migrations"

	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var db *gorm.DB

func init() {
	err := godotenv.Load(".env")
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	dbHost := os.Getenv("DB_HOST")
	dbPort := os.Getenv("DB_PORT")
	dbName := os.Getenv("DB_NAME")
	dbUser := os.Getenv("DB_USER")
	dbPassword := os.Getenv("DB_PASSWORD")

	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable TimeZone=Europe/Berlin", dbHost, dbUser, dbPassword, dbName, dbPort)
	//dsn := "host=localhost user=backend password=87weuhfriwj3nrkmf dbname=sheltify port=5432 sslmode=disable TimeZone=Asia/Shanghai"
	fmt.Println(dsn)
	db, err = gorm.Open(postgres.Open(dsn), &gorm.Config{
		PrepareStmt: true,
	})

	if err != nil {
		fmt.Println(err)
	}

	migrations.Migrate(db)
	//TODO use db-user with less privileges for everything but migrations
}
