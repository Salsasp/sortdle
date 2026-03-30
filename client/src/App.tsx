import { useEffect, useRef, useState } from 'react'
import './App.css'
import Dropdown from './Components/Dropdown'
import SortCanvas from './Components/SortCanvas'
import { ALGO_SELECTOR_LABELS, ALGO_SELECTOR_VALUES } from './constants/algorithms'
import type { AlgorithmSelectorOption } from './utils/types'
import { getAllPuzzlesData, getDailyPuzzleData, getDailyRandomNumbers } from './Components/ApiSlice'
import GuessVisualizer from './Components/GuessVisualizer'
 
function App() {
  const DEFAULT_SELECTOR_ALGORITHM = 'bubble';
  const canvasRef = useRef<any>(null);
 
  const [arr, setArr] = useState<number[]>([]);
  const [dailyAlgorithm, setDailyAlgorithm] = useState<string>(DEFAULT_SELECTOR_ALGORITHM);
  const [puzzleDate, setPuzzleDate] = useState<string>();
  const [selectedAlgorithm, setSelectedAlgorithm] = useState(DEFAULT_SELECTOR_ALGORITHM);
  const [guessesRemaining, setGuessesRemaining] = useState(5); // TODO: This should probably use constants instead of magic numbers
  const [guessSuccess, setGuessSuccess] = useState(false);
  const [percentUncovered, setPercentUncovered] = useState(Math.min((100 / 5) * (6-guessesRemaining), 100)); // This too

  const userFailed = !guessSuccess && guessesRemaining === 0;

  const abortRef = useRef<AbortController | null>(null);
 
  useEffect(() => {
    async function fetchNumbers() {
      const numbers = await getDailyRandomNumbers();
      setArr(numbers);
    }
    fetchNumbers();
  }, []);
 
  useEffect(() => {
    async function fetchDailyPuzzleData() {
      const puzzleData = await getDailyPuzzleData();
      setPuzzleDate(puzzleData['date'])
      setDailyAlgorithm(puzzleData['algorithm'])
      setArr(puzzleData['numbers'])
    }
    fetchDailyPuzzleData();
  }, []);

  useEffect(() => {
    async function fetchAllPuzzleData() {
      const puzzleData = await getAllPuzzlesData();
      // add setters here when implemented
    }
    fetchAllPuzzleData();
  })
 
  const handleGuessSubmission = () => {
    abortRef.current?.abort();
    abortRef.current = new AbortController();

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
 
  const options: AlgorithmSelectorOption[] = ALGO_SELECTOR_VALUES.map((value, index) => ({
    value: value,
    label: ALGO_SELECTOR_LABELS[index]
  }));
 
  return (
    <>
      <div className='main-title-container'>
        <h1 className='main-title-text'>Sortdle</h1>
        <h1 className='main-title-text'>{puzzleDate}</h1>
      </div>
 
      {guessSuccess && <p className="status-message status-success">✓ Correct! Well played.</p>}
      {userFailed && <p className="status-message status-fail">✗ Better luck next time!</p>}
 
      <SortCanvas ref={canvasRef} numbers={arr} percentUncovered={percentUncovered} />
 
      <GuessVisualizer guessesRemaining={guessesRemaining} />
 
      <div className="controls-row">
        <Dropdown
          id='algo-selector'
          options={options}
          value={selectedAlgorithm}
          onChange={setSelectedAlgorithm}
        />
        <button className="btn btn-sort" onClick={() => canvasRef.current.runSort(dailyAlgorithm, abortRef)}>
          Sort!
        </button>
        <button className="btn btn-guess" onClick={handleGuessSubmission}>
          Guess
        </button>
      </div>
    </>
  )
}
 
export default App