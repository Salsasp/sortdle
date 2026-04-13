import { useEffect, useRef, useState } from 'react'
import './App.css'
import Dropdown from './Components/Dropdown'
import SortCanvas from './Components/SortCanvas'
import { ALGO_SELECTOR_LABELS, ALGO_SELECTOR_VALUES, type AlgorithmSelectorValue } from './constants/algorithms'
import { type AlgorithmSelectorOption, type AppProps } from './utils/types'
import { getAllPuzzlesData, getPuzzleDataByDate } from './Components/ApiSlice'
import GuessVisualizer from './Components/GuessVisualizer'
import PuzzleSideDrawer from './Components/PuzzleSideDrawer'
import { useGameState } from './hooks/UseGameState'
 
function App({ puzzleDateArg = 'today' }: AppProps) {
  const canvasRef = useRef<any>(null);
 
  const [sideDrawerOpen, setSideDrawerOpen] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const gameState = useGameState();
 
  useEffect(() => { // fetch all puzzle data on page load
    async function fetchAllPuzzleData() {
      const puzzleData = await getAllPuzzlesData();
      gameState.updatePuzzleData(puzzleData);
    }
    fetchAllPuzzleData();
  }, []);
 
  useEffect(() => { // handle route change; reset variables and new puzzle data
    abortRef.current?.abort(); // abort any in progress animations on route change
    abortRef.current = new AbortController();

    gameState.resetGame();
    setSideDrawerOpen(false);

    async function fetchDailyPuzzleData() {
      if (!puzzleDateArg) return;
      const puzzleData = await getPuzzleDataByDate(puzzleDateArg);
      gameState.setPuzzleDate(puzzleData['date'])
      gameState.setDailyAlgorithm(puzzleData['algorithm'])
      gameState.setArr(puzzleData['numbers'])
    }
    fetchDailyPuzzleData();
  }, [puzzleDateArg]);

  const handleSort = () => {
    abortRef.current?.abort();
    abortRef.current = new AbortController();
    canvasRef.current.runSort(gameState.dailyAlgorithm, abortRef.current.signal);
  }

  const handleGuessSubmission = () => {
    gameState.handleGuessSubmission(abortRef)
  }
 
  const options: AlgorithmSelectorOption[] = ALGO_SELECTOR_VALUES.map((value, index) => ({
    value: value,
    label: ALGO_SELECTOR_LABELS[index]
  }));

  const dailyAlgorithmLabel = ALGO_SELECTOR_LABELS[
    ALGO_SELECTOR_VALUES.indexOf(gameState.dailyAlgorithm as AlgorithmSelectorValue)
  ];
 
  return (
    <>
      <div className='main-title-container'>
        <h1 className='main-title-text'>Sortdle</h1>
        <h1 className='main-title-text'>{gameState.puzzleDate}</h1>
      </div>

      <div className='side-drawer-button-container'>
        <button className='drawer-button' onClick={()=>{setSideDrawerOpen(true)}}>
          <img src='./images/hamburger.png'></img>
        </button>
      </div>
 
      {gameState.guessSuccess && <p className="status-message status-success">✓ Correct! Well played.</p>}
      {gameState.userFailed && <p className="status-message status-fail">✗ Better luck next time!</p>}
      {(gameState.guessSuccess || gameState.userFailed) && <p className="status-message correct-algorithm">Today's algorithm was {dailyAlgorithmLabel}</p>}

      {sideDrawerOpen && 
      <PuzzleSideDrawer
        data={gameState.puzzleData}
        isOpen={sideDrawerOpen}
        setSideDrawerOpen={setSideDrawerOpen}>
      </PuzzleSideDrawer>
      }
 
      <SortCanvas ref={canvasRef} numbers={gameState.arr} percentUncovered={gameState.percentUncovered} />
 
      <GuessVisualizer guessesRemaining={gameState.guessesRemaining} />
 
      <div className="controls-row">
        <Dropdown
          id='algo-selector'
          options={options}
          value={gameState.selectedAlgorithm}
          onChange={gameState.setSelectedAlgorithm}
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