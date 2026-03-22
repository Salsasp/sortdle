
export async function getDailyRandomNumbers() {
    const response = await fetch("/api/numbers");
    const numbers = await response.json();
    return numbers;
}