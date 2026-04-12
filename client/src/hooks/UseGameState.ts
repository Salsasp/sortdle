import { useState, type RefObject } from "react";
import type { PuzzleData } from "../utils/types";

export function useGameState() {
    const DEFAULT_SELECTOR_ALGORITHM = 'bubble';
    const [arr, setArr] = useState<number[]>([]);
    const [dailyAlgorithm, setDailyAlgorithm] = useState<string>(DEFAULT_SELECTOR_ALGORITHM);
    const [puzzleDate, setPuzzleDate] = useState<string>();
    const [puzzleData, setPuzzleData] = useState<PuzzleData[]>([]);
    const [selectedAlgorithm, setSelectedAlgorithm] = useState(DEFAULT_SELECTOR_ALGORITHM);
    const [guessesRemaining, setGuessesRemaining] = useState(5); // TODO: This should probably use constants instead of magic numbers
    const [guessSuccess, setGuessSuccess] = useState(false);
    const [percentUncovered, setPercentUncovered] = useState(Math.min((100 / 5) * (6-guessesRemaining), 100)); // This too
    const userFailed = !guessSuccess && guessesRemaining === 0;

    const updatePuzzleData = (puzzleData: any[]) => {
        setPuzzleData(puzzleData.map(element => ({
        date: element['date'],
        algorithm: element['algorithm'],
        numbers: element['numbers']
        })));
    }

    const resetGame = () => {
      setSelectedAlgorithm(DEFAULT_SELECTOR_ALGORITHM)
      setGuessesRemaining(5);
      setPercentUncovered(Math.min((100 / 5) * (6 - 5), 100));
      setGuessSuccess(false);
    }

    const handleGuessSubmission = (abortRef: RefObject<AbortController | null>) => {
        abortRef.current?.abort();

        if (selectedAlgorithm === dailyAlgorithm && !userFailed) {
            setGuessSuccess(true);
            setPercentUncovered(100);
            setGuessesRemaining(0);
        }
        else {
            const newGuessesRemaining = Math.max(guessesRemaining - 1, 0);
            setGuessesRemaining(newGuessesRemaining);
            setPercentUncovered(Math.min((100 / 5) * (6 - newGuessesRemaining), 100));
        }
    };

    //TODO: reduce the amount of things being returned and constain them to a type
    return {
        arr, dailyAlgorithm, puzzleDate, puzzleData, selectedAlgorithm, guessesRemaining, guessSuccess, percentUncovered, userFailed,
        setArr, setDailyAlgorithm, setPuzzleDate, setPuzzleData, setSelectedAlgorithm, setGuessesRemaining, setGuessSuccess, setPercentUncovered,
        updatePuzzleData, resetGame, handleGuessSubmission,
    }
}