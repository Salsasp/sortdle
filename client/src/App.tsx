import { useRef, useState } from 'react'
import './App.css'
import Dropdown from './Components/Dropdown'
import SortCanvas from './Components/SortCanvas'
import { ALGO_SELECTOR_LABELS, ALGO_SELECTOR_VALUES } from './constants/algorithms'
import type { AlgorithmSelectorOption } from './utils/types'

function App() {

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

  const canvasRef = useRef<any>(null);

  const [arr, setArr] = useState([
          42, 17, 89, 23, 76, 5, 64, 31, 58, 12,
          95, 38, 71, 2, 84, 27, 49, 66, 14, 53,
          91, 7, 36, 80, 19, 62, 44, 28, 73, 10
  ]);
  const dailyAlgorithm = "bubble"; // TODO: set this from a prop that gets passed from an API call to go endpoint
  const [selectedAlgorithm, setSelectedAlgorithm] = useState(dailyAlgorithm)
  const [guessesRemaining, setGuessesRemaining] = useState(4);
  const percentUncovered = (100 / 5) * (5-guessesRemaining);

  return (
    <>
      <div>
        <h1 className='MainTitle'>Sortdle</h1>
      </div>
        <SortCanvas ref={canvasRef} numbers={arr} percentUncovered={percentUncovered}></SortCanvas>
        <Dropdown 
          id='algo-selector' 
          options={options}
          value={selectedAlgorithm}
          onChange={setSelectedAlgorithm}>
        </Dropdown>
        <button onClick={() => canvasRef.current.runSort(dailyAlgorithm)}>Sort!</button>
        <button onClick={handleGuessSubmission}>Guess</button>
    </>
  )
}

export default App
