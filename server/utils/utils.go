package utils

import (
	"database/sql"
	"log"
)

func AddPuzzleTestRow(date string, algorithm string, numbers []int, db *sql.DB) {
	query := "INSERT INTO daily_puzzle (puzzle_date, algorithm, numbers) VALUES (?, ?, ?)"
	res, err := db.Exec(query, date, algorithm, numbers)
	if err != nil {
		log.Fatal(err, res)
	}
}
