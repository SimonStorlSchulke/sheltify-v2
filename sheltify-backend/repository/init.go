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

	var dbHost string
	var dbPort string
	var dbName string
	var dbUser string
	var dbPassword string

	if os.Getenv("USE_TEST_DB") == "true" {
		fmt.Println("Using Test-DB")
		dbHost = "localhost"
		dbPort = "5435"
		dbName = "sheltify-test-db"
		dbUser = "postgres"
		dbPassword = "test"
	} else {
		dbHost = os.Getenv("DB_HOST")
		dbPort = os.Getenv("DB_PORT")
		dbName = os.Getenv("DB_NAME")
		dbUser = os.Getenv("DB_USER")
		dbPassword = os.Getenv("DB_PASSWORD")
	}

	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable TimeZone=Europe/Berlin", dbHost, dbUser, dbPassword, dbName, dbPort)
	fmt.Println(dsn)
	db, err = gorm.Open(postgres.Open(dsn), &gorm.Config{
		PrepareStmt: true,
	})

	if err != nil {
		log.Fatalln("Cannot connect to database:", err)
	}

	migrations.Migrate(db)
}
