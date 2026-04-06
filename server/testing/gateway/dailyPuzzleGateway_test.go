package gateway_test

import (
	"encoding/json"
	"regexp"
	"sortdle-server/gateway"
	"sortdle-server/utils"
	"testing"
	"time"

	"github.com/DATA-DOG/go-sqlmock"
)

func TestGetDailyPuzzleRow(t *testing.T) {
	// Arrange
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("Failed to create mock: %v", err)
	}
	defer db.Close()

	rows := sqlmock.NewRows([]string{"puzzle_date", "algorithm", "numbers"}).
		AddRow("2024-01-01", "bubble", []byte(`[1,2,3]`))

	mock.ExpectQuery("SELECT puzzle_date, algorithm, numbers FROM daily_puzzle").
		WillReturnRows(rows)

	// Act
	result := gateway.GetDailyPuzzleRow(db)

	// Assert
	if result.Algorithm != "bubble" {
		t.Errorf("got %v, want bubble", result.Algorithm)
	}

	if !isValidDate(result.Date) {
		t.Errorf("Invalid date format, got %v", result.Date)
	}

	if result.Numbers == nil {
		t.Errorf("Numbers is nil")
	}

	if len(result.Numbers) == 0 {
		t.Errorf("Numbers is empty")
	}

	if err := mock.ExpectationsWereMet(); err != nil {
		t.Errorf("unfulfilled expectations: %v", err)
	}
}

func TestGetAllPuzzleRows(t *testing.T) {
	// Arrange
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("Failed to create mock: %v", err)
	}
	defer db.Close()

	rows := sqlmock.NewRows([]string{"puzzle_date", "algorithm", "numbers"}).
		AddRow("2024-01-01", "bubble", []byte(`[1,2,3]`)).
		AddRow("2024-01-02", "merge", []byte(`[4,5,6]`))

	mock.ExpectQuery("SELECT puzzle_date, algorithm, numbers FROM daily_puzzle").
		WillReturnRows(rows)

	// Act
	result := gateway.GetAllPuzzleRows(db)

	// Assert
	if len(result) != 2 {
		t.Errorf("got %v results, want 2", len(result))
	}
	if result[0].Algorithm != "bubble" {
		t.Errorf("got %v, want bubble", result[0].Algorithm)
	}

	if !isValidDate(result[0].Date) {
		t.Errorf("Invalid date format, got %v", result[0].Date)
	}

	if result[0].Numbers == nil {
		t.Errorf("Numbers is nil")
	}

	if len(result[0].Numbers) == 0 {
		t.Errorf("Numbers is empty")
	}

	if err := mock.ExpectationsWereMet(); err != nil {
		t.Errorf("unfulfilled expectations: %v", err)
	}
}

func TestGetPuzzleRowByDate(t *testing.T) {
	// Arrange
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("Failed to create mock: %v", err)
	}
	defer db.Close()

	rows := sqlmock.NewRows([]string{"puzzle_date", "algorithm", "numbers"}).
		AddRow("2024-01-01", "bubble", []byte(`[1,2,3]`))

	mock.ExpectQuery("SELECT puzzle_date, algorithm, numbers FROM daily_puzzle WHERE puzzle_date = ?").
		WillReturnRows(rows)

	// Act
	result := gateway.GetPuzzleRowByDate(db, "2024-01-01")

	// Assert
	if result.Algorithm != "bubble" {
		t.Errorf("got %v, want bubble", result.Algorithm)
	}

	if !isValidDate(result.Date) {
		t.Errorf("Invalid date format, got %v", result.Date)
	}

	if result.Numbers == nil {
		t.Errorf("Numbers is nil")
	}

	if len(result.Numbers) == 0 {
		t.Errorf("Numbers is empty")
	}

	if err := mock.ExpectationsWereMet(); err != nil {
		t.Errorf("unfulfilled expectations: %v", err)
	}
}

func TestSetDailyPuzzle(t *testing.T) {
	// Arrange
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("Failed to create mock: %v", err)
	}
	defer db.Close()

	data := utils.DailyPuzzle{Date: "2024-01-01", Algorithm: "bubble", Numbers: []int{1, 2, 3}}
	serializedNums, err := json.Marshal(data.Numbers)
	if err != nil {
		t.Errorf("Error serializing int array, data: %v", data.Numbers)
	}
	mock.ExpectExec(regexp.QuoteMeta("INSERT INTO daily_puzzle(puzzle_date, algorithm, numbers) VALUES (?,?,?);")).
		WithArgs("2024-01-01", "bubble", serializedNums).
		WillReturnResult(sqlmock.NewResult(1, 1))

	// Act
	gateway.SetDailyPuzzle(&data, db)

	// Assert
	if err := mock.ExpectationsWereMet(); err != nil {
		t.Errorf("unfulfilled expectations: %v", err)
	}
}

func isValidDate(dateStr string) bool {
	_, err := time.Parse("2006-01-02", dateStr)
	return err == nil
}
