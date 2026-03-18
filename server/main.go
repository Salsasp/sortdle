package main

import (
	"fmt"
	"net/http"
	"sortdle-server/handlers"
)

func main() {
	http.HandleFunc("/api/numbers", handlers.GetNumbers)

	fmt.Println("Server running on :8080")
	http.ListenAndServe(":8080", nil)
}
