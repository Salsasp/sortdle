const API_BASE = import.meta.env.VITE_API_URL;

export async function getDailyRandomNumbers() {
    const response = await fetch(`${API_BASE}/api/numbers`);
    const numbers = await response.json();
    return numbers;
}

export async function getDailyPuzzleData() {
    const response = await fetch(`${API_BASE}/api/getDailyPuzzle`);
    const data = await response.json();
    return data;
}

export async function getAllPuzzlesData() {
    const response = await fetch(`${API_BASE}/api/getAllPuzzles`);
    const data = await response.json();
    return data;
}

export async function getPuzzleDataByDate(date: string) {
    const response = await fetch(`${API_BASE}/api/getPuzzleByDate?date=${date}`);
    const data = await response.json();
    return data;
}