import './App.css'
import Dropdown from './Components/Dropdown'
import SortCanvas from './Components/SortCanvas'
import { ALGO_SELECTOR_LABELS, ALGO_SELECTOR_VALUES } from './constants/algorithms'
import type { AlgorithmSelectorOption } from './utils/types'

function App() {
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
        <SortCanvas></SortCanvas>
        <Dropdown 
          label='Select an Algorithm!' 
          id='algo-selector' 
          options={options}>
        </Dropdown>
    </>
  )
}

export default App
