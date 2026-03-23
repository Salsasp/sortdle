package gateway

import (
	"database/sql"
	"fmt"
	"time"
)

func GetDailyPuzzleRow(db *sql.DB) []string {
	var puzzleDate string
	var algorithm string
	var numbers string
	rowData := make([]string, 3)

	query := "SELECT puzzle_date, algorithm, numbers FROM daily_puzzle WHERE puzzle_date = ?"
	todayDate := time.Now().Format("2006-01-02")
	err := db.QueryRow(query, todayDate).Scan(&puzzleDate, &algorithm, &numbers)

	if err == sql.ErrNoRows {
		return rowData
	}

	if err != nil {
		fmt.Println("Error fetching row from database: " + err.Error())
		return rowData
	}

	rowData[0] = puzzleDate
	rowData[1] = algorithm
	rowData[2] = numbers
	return rowData
}
