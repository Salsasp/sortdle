package gateway

import (
	"database/sql"
	"encoding/json"
	"log"
	"sortdle-server/utils"
	"time"
)

func GetDailyPuzzleRow(db *sql.DB) utils.DailyPuzzle {
	var puzzleDate string
	var algorithm string
	var rawNumbers []byte

	query := "SELECT puzzle_date, algorithm, numbers FROM daily_puzzle WHERE puzzle_date = ?"
	todayDate := time.Now().Format("2006-01-02") //dear god why can't you be normal time library
	err := db.QueryRow(query, todayDate).Scan(&puzzleDate, &algorithm, &rawNumbers)

	if err == sql.ErrNoRows {
		return utils.DailyPuzzle{}
	}

	if err != nil {
		log.Fatal(err)
	}

	var numbers []int
	err = json.Unmarshal(rawNumbers, &numbers)
	if err != nil {
		log.Fatal(err)
	}

	return utils.DailyPuzzle{
		Date:      puzzleDate,
		Algorithm: algorithm,
		Numbers:   numbers,
	}
}

func GetAllPuzzleRows(db *sql.DB) []utils.DailyPuzzle {
	query := "SELECT puzzle_date, algorithm, numbers FROM daily_puzzle;"
	rows, err := db.Query(query)

	if err != nil {
		log.Fatal(err)
	}

	defer rows.Close()

	var dailyPuzzles []utils.DailyPuzzle

	for rows.Next() {
		var (
			date       string
			algorithm  string
			rawNumbers []byte
		)
		if err := rows.Scan(&date, &algorithm, &rawNumbers); err != nil {
			log.Fatal(err)
		}

		var numbers []int
		err = json.Unmarshal(rawNumbers, &numbers)
		if err != nil {
			log.Fatal(err)
		}
		dailyPuzzle := utils.DailyPuzzle{
			Date:      date,
			Algorithm: algorithm,
			Numbers:   numbers,
		}

		dailyPuzzles = append(dailyPuzzles, dailyPuzzle)
	}

	return dailyPuzzles
}

func GetPuzzleRowByDate(db *sql.DB, date string) utils.DailyPuzzle {
	var puzzleDate string
	var algorithm string
	var rawNumbers []byte
	query := "SELECT puzzle_date, algorithm, numbers FROM daily_puzzle WHERE puzzle_date = ?"
	err := db.QueryRow(query, date).Scan(&puzzleDate, &algorithm, &rawNumbers)

	if err == sql.ErrNoRows {
		return utils.DailyPuzzle{}
	}

	if err != nil {
		log.Fatal(err)
	}

	var numbers []int
	err = json.Unmarshal(rawNumbers, &numbers)
	if err != nil {
		log.Fatal(err)
	}

	return utils.DailyPuzzle{
		Date:      puzzleDate,
		Algorithm: algorithm,
		Numbers:   numbers,
	}
}

func SetDailyPuzzle(data *utils.DailyPuzzle, db *sql.DB) {
	query := "INSERT INTO daily_puzzle(puzzle_date, algorithm, numbers) VALUES (?,?,?);"
	date := data.Date
	algorithm := data.Algorithm
	serializedNums, err := json.Marshal(data.Numbers)
	if err != nil {
		log.Fatal(err)
	}

	res, err := db.Exec(query, date, algorithm, serializedNums)
	if err != nil {
		log.Fatal(err, res)
	}
}
