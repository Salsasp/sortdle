import { useEffect, useRef, useState } from 'react'
import './App.css'
import Dropdown from './Components/Dropdown'
import SortCanvas from './Components/SortCanvas'
import { ALGO_SELECTOR_LABELS, ALGO_SELECTOR_VALUES, type AlgorithmSelectorValue } from './constants/algorithms'
import { type PuzzleData, type AlgorithmSelectorOption, type AppProps } from './utils/types'
import { getAllPuzzlesData, getPuzzleDataByDate } from './Components/ApiSlice'
import GuessVisualizer from './Components/GuessVisualizer'
import PuzzleSideDrawer from './Components/PuzzleSideDrawer'
 
function App({ puzzleDateArg = 'today' }: AppProps) {
  const DEFAULT_SELECTOR_ALGORITHM = 'bubble';
  const canvasRef = useRef<any>(null);
 
  const [arr, setArr] = useState<number[]>([]);
  const [dailyAlgorithm, setDailyAlgorithm] = useState<string>(DEFAULT_SELECTOR_ALGORITHM);
  const [puzzleDate, setPuzzleDate] = useState<string>();
  const [puzzleData, setPuzzleData] = useState<PuzzleData[]>([]);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState(DEFAULT_SELECTOR_ALGORITHM);
  const [guessesRemaining, setGuessesRemaining] = useState(5); // TODO: This should probably use constants instead of magic numbers
  const [guessSuccess, setGuessSuccess] = useState(false);
  const [percentUncovered, setPercentUncovered] = useState(Math.min((100 / 5) * (6-guessesRemaining), 100)); // This too
  const [sideDrawerOpen, setSideDrawerOpen] = useState(false);

  const userFailed = !guessSuccess && guessesRemaining === 0;
 
  const abortRef = useRef<AbortController | null>(null);
 
  useEffect(() => { // fetch all puzzle data on page load
    async function fetchAllPuzzleData() {
      const puzzleData = await getAllPuzzlesData();
      updatePuzzleData(puzzleData);
    }
    fetchAllPuzzleData();
  }, []);
 
  useEffect(() => { // handle route change; reset variables and new puzzle data
    abortRef.current?.abort(); // abort any in progress animations on route change
    abortRef.current = new AbortController();

    resetGame();
    setSideDrawerOpen(false);

    async function fetchDailyPuzzleData() {
      if (!puzzleDateArg) return;
      const puzzleData = await getPuzzleDataByDate(puzzleDateArg);
      setPuzzleDate(puzzleData['date'])
      setDailyAlgorithm(puzzleData['algorithm'])
      setArr(puzzleData['numbers'])
    }
    fetchDailyPuzzleData();
  }, [puzzleDateArg]);
 
  const handleGuessSubmission = () => {
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

  const handleSort = () => {
    abortRef.current?.abort();
    abortRef.current = new AbortController();
    canvasRef.current.runSort(dailyAlgorithm, abortRef.current.signal);
}

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
 
  const options: AlgorithmSelectorOption[] = ALGO_SELECTOR_VALUES.map((value, index) => ({
    value: value,
    label: ALGO_SELECTOR_LABELS[index]
  }));

  //TODO: fix this horrifically janky mess
  const dailyAlgorithmLabel = ALGO_SELECTOR_LABELS[ALGO_SELECTOR_VALUES.indexOf(dailyAlgorithm as unknown as AlgorithmSelectorValue)];
 
  return (
    <>
      <div className='main-title-container'>
        <h1 className='main-title-text'>Sortdle</h1>
        <h1 className='main-title-text'>{puzzleDate}</h1>
      </div>

      <div className='side-drawer-button-container'>
        <h3>Previous Puzzles</h3>
        <button className='drawer-button' onClick={()=>{setSideDrawerOpen(true)}}>
          <img src='./images/hamburger.png'></img>
        </button>
      </div>
 
      {guessSuccess && <p className="status-message status-success">✓ Correct! Well played.</p>}
      {userFailed && <p className="status-message status-fail">✗ Better luck next time!</p>}
      {(guessSuccess || userFailed) && <p className="status-message correct-algorithm">Today's algorithm was {dailyAlgorithmLabel}</p>}

      {sideDrawerOpen && 
      <PuzzleSideDrawer
        data={puzzleData}
        isOpen={sideDrawerOpen}
        setSideDrawerOpen={setSideDrawerOpen}>
      </PuzzleSideDrawer>
      }
 
      <SortCanvas ref={canvasRef} numbers={arr} percentUncovered={percentUncovered} />
 
      <GuessVisualizer guessesRemaining={guessesRemaining} />
 
      <div className="controls-row">
        <Dropdown
          id='algo-selector'
          options={options}
          value={selectedAlgorithm}
          onChange={setSelectedAlgorithm}
        />
        <button className="btn btn-sort" onClick={handleSort}>
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