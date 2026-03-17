import './App.css'
import Dropdown from './Components/Dropdown'
import SortCanvas from './Components/SortCanvas'

function App() {

  return (
    <>
      <div>
        <h1 className='MainTitle'>Sortdle</h1>
      </div>
        <SortCanvas></SortCanvas>
        <Dropdown></Dropdown>
    </>
  )
}

export default App
