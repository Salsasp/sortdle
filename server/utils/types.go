package utils

type DailyPuzzle struct {
	Date      string `json:"date"`
	Algorithm string `json:"algorithm"`
	Numbers   []int  `json:"numbers"`
}

var Algorithms = [9]string{
	"bubble",
	"selection",
	"insertion",
	"merge",
	"quick",
	"heap",
	"counting",
	"radix",
	"bucket",
}
