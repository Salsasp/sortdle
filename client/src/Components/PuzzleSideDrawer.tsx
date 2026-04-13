import type { PuzzleSideDrawerProps } from "../utils/types";
import '../Components/stylesheets/sidedrawer.css'
import { useNavigate } from "react-router-dom";

function PuzzleSideDrawer (props: PuzzleSideDrawerProps) {
    const handleCloseClick = () => {
        props.setSideDrawerOpen(false)
    }
    const navigate =  useNavigate();

    return (
        <>
            {props.isOpen && <div className="drawer-backdrop" onClick={handleCloseClick} />}
            <div className={`drawer ${props.isOpen ? 'drawer--open' : ''}`}>
                <div className="header-container">
                    <div className="drawer-brand">
                        <div className="logo">
                            <img src="sortdle.svg"></img>
                        </div>
                        <h2 className="brand-title">SORTDLE</h2>
                    </div>
                </div>
                <div className="drawer-nav">
                    <button className="nav-item">Today's Puzzle</button>
                    <button className="nav-item">How to Play</button>
                    <button className="nav-item">Statistics</button>
                </div>
                <div className="header-container">
                    <h3>Previous Puzzles</h3>
                </div>
                <div className="elements-container">
                    {props.data.map((puzzle) => (
                        <div className="puzzle-side-drawer-element">
                            <button className="drawer-item-clickable" onClick={() => navigate(`/${puzzle.date}`)}>
                                {puzzle.date}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}

export default PuzzleSideDrawer;