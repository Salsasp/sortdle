import { useEffect, useRef, useState } from 'react'
import './App.css'
import Dropdown from './Components/Dropdown'
import SortCanvas from './Components/SortCanvas'
import { ALGO_SELECTOR_LABELS, ALGO_SELECTOR_VALUES } from './constants/algorithms'
import type { AlgorithmSelectorOption } from './utils/types'
import { getDailyPuzzleData, getDailyRandomNumbers } from './Components/ApiSlice'

function App() {
  const DEFAULT_SELECTOR_ALGORITHM = 'bubble';
  const canvasRef = useRef<any>(null);

  const [arr, setArr] = useState<number[]>([]);
  const [dailyAlgorithm, setDailyAlgorithm] = useState<string>(DEFAULT_SELECTOR_ALGORITHM);
  const [puzzleDate, setPuzzleDate] = useState<string>();
  const [selectedAlgorithm, setSelectedAlgorithm] = useState(DEFAULT_SELECTOR_ALGORITHM);
  const [guessesRemaining, setGuessesRemaining] = useState(4); // TODO: This should probably use constants instead of magic numbers
  const percentUncovered = (100 / 5) * (5-guessesRemaining); // This too

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

  const handleGuessSubmission = () => {
    if (selectedAlgorithm === dailyAlgorithm) {
      console.log("Success! Good Job!") //placeholder obviously. This should apply a modal or something
    }
    else {
      guessesRemaining -1 <= 0 ? setGuessesRemaining(0) : setGuessesRemaining(guessesRemaining - 1);
    }
    console.log(guessesRemaining);
  };

  const options: AlgorithmSelectorOption[] = ALGO_SELECTOR_VALUES.map((value, index) => ({
      value: value,
      label: ALGO_SELECTOR_LABELS[index]
    })
  );

  return (
    <>
      <div>
        <h1 className='MainTitle'>Sortdle</h1>
      </div>
        <SortCanvas ref={canvasRef} numbers={arr} percentUncovered={percentUncovered}></SortCanvas>
        <Dropdown 
          id='algo-selector' 
          options={options}
          value={"bubble"}
          onChange={setSelectedAlgorithm}>
        </Dropdown>
        <button onClick={() => canvasRef.current.runSort(dailyAlgorithm)}>Sort!</button>
        <button onClick={handleGuessSubmission}>Guess</button>
    </>
  )
}

export default App
