package gateway

import (
	"database/sql"
	"encoding/json"
	"log"
	"time"
)

type DailyPuzzle struct {
	Date      string `json:"date"`
	Algorithm string `json:"algorithm"`
	Numbers   []int  `json:"numbers"`
}

func GetDailyPuzzleRow(db *sql.DB) DailyPuzzle {
	var puzzleDate string
	var algorithm string
	var rawNumbers []byte

	query := "SELECT puzzle_date, algorithm, numbers FROM daily_puzzle WHERE puzzle_date = ?"
	todayDate := time.Now().Format("2006-01-02") //dear god why can't you be normal time library
	err := db.QueryRow(query, todayDate).Scan(&puzzleDate, &algorithm, &rawNumbers)

	if err == sql.ErrNoRows {
		return DailyPuzzle{}
	}

	if err != nil {
		log.Fatal(err)
	}

	var numbers []int
	err = json.Unmarshal(rawNumbers, &numbers)
	if err != nil {
		log.Fatal(err)
	}

	return DailyPuzzle{
		Date:      puzzleDate,
		Algorithm: algorithm,
		Numbers:   numbers,
	}
}
