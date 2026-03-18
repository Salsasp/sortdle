package handlers

import (
	"encoding/json"
	"math/rand/v2"
	"net/http"
)

const NUMBER_ARRAY_SIZE = 100

func GetNumbers(w http.ResponseWriter, r *http.Request) {
	nums := make([]int, NUMBER_ARRAY_SIZE)

	for i := range nums {
		nums[i] = rand.IntN(100)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(nums)
}
