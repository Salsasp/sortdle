package handlers

import (
	"encoding/json"
	"math/rand/v2"
	"net/http"
)

const NUMBER_ARRAY_SIZE = 200

func GetNumbers(w http.ResponseWriter, r *http.Request) {
	nums := make([]int, NUMBER_ARRAY_SIZE)

	for i := range nums {
		nums[i] = rand.IntN(500)
	}

	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*") //TODO: lock this down in prod
	json.NewEncoder(w).Encode(nums)
}
