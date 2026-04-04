package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"os"
	"sortdle-server/handlers"

	_ "github.com/go-sql-driver/mysql"
	"github.com/joho/godotenv"
	"github.com/robfig/cron/v3"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	dsn := fmt.Sprintf("%s:%s@tcp(%s:3306)/%s",
		os.Getenv("DB_USER"),
		os.Getenv("DB_PASSWORD"),
		os.Getenv("DB_HOST"),
		os.Getenv("DB_NAME"),
	)

	db, err := sql.Open("mysql", dsn)
	if err != nil {
		log.Fatal(err)
	}

	c := cron.New()
	c.AddFunc("0 0 * * *", func() {
		handlers.SetDailyPuzzle(db)
	})
	c.Start()

	http.HandleFunc("/api/getDailyPuzzle", func(w http.ResponseWriter, r *http.Request) {
		handlers.GetDailyPuzzle(w, r, db)
	})

	http.HandleFunc("/api/getPuzzleByDate", func(w http.ResponseWriter, r *http.Request) {
		handlers.GetPuzzleRowByDate(w, r, db)
	})

	http.HandleFunc("/api/getAllPuzzles", func(w http.ResponseWriter, r *http.Request) {
		handlers.GetAllPuzzles(w, r, db)
	})

	http.HandleFunc("/api/numbers", handlers.GetNumbers)

	fmt.Println("Server running on :8080")
	http.ListenAndServe(":8080", nil)

	defer c.Stop()
	defer db.Close()
}
