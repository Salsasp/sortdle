package handlers

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"sortdle-server/gateway"
	"sortdle-server/utils"
	"time"
)

const NUMBER_ARRAY_SIZE = 200

func GetNumbers(w http.ResponseWriter, r *http.Request) {
	nums := utils.GetRandomNumbers(100, 500)

	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*") //TODO: lock this down in prod
	json.NewEncoder(w).Encode(nums)
}

func GetDailyPuzzle(w http.ResponseWriter, r *http.Request, db *sql.DB) {
	rowData := gateway.GetDailyPuzzleRow(db)

	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*") //TODO: lock this down in prod
	json.NewEncoder(w).Encode(rowData)
}

func GetAllPuzzles(w http.ResponseWriter, r *http.Request, db *sql.DB) {
	rows := gateway.GetAllPuzzleRows(db)

	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*") //TODO: lock this down in prod
	json.NewEncoder(w).Encode(rows)
}

func SetDailyPuzzle(db *sql.DB) {
	nums := utils.GetRandomNumbers(100, 500)
	date := time.Now().Format("2006-01-02")
	algorithm := utils.GetRandomAlgorithm()
	data := utils.DailyPuzzle{
		Date:      date,
		Algorithm: algorithm,
		Numbers:   nums,
	}

	gateway.SetDailyPuzzle(&data, db)
}
