package utils

import (
	"database/sql"
	"log"
	"math/rand/v2"
)

func AddPuzzleTestRow(date string, algorithm string, numbers []int, db *sql.DB) {
	query := "INSERT INTO daily_puzzle (puzzle_date, algorithm, numbers) VALUES (?, ?, ?)"
	res, err := db.Exec(query, date, algorithm, numbers)
	if err != nil {
		log.Fatal(err, res)
	}
}

func GetRandomNumbers(size int, rangeMax int) []int {
	nums := make([]int, size)

	for i := range nums {
		nums[i] = rand.IntN(rangeMax)
	}

	return nums
}

func GetRandomAlgorithm() string {
	algorithms := Algorithms
	algorithm := algorithms[rand.IntN(len(Algorithms)-1)]

	return algorithm
}
