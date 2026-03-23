
export async function getDailyRandomNumbers() {
    const response = await fetch("/api/numbers");
    const numbers = await response.json();
    return numbers;
}

export async function getDailyPuzzleData() {
    const response = await fetch("/api/getDailyPuzzle");
    const data = await response.json();
    return data;
}