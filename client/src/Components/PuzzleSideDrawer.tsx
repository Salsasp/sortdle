import type { PuzzleSideDrawerProps } from "../utils/types";
import '../Components/stylesheets/sidedrawer.css'

function PuzzleSideDrawer (props: PuzzleSideDrawerProps) {
    const handleCloseClick = () => {
        props.setSideDrawerOpen(false)
    }

    return ( // TODO: replace "Close Me" with 3 line stack icon
        <>
            {props.isOpen && <div className="drawer-backdrop" onClick={handleCloseClick} />}
            <div className={`drawer ${props.isOpen ? 'drawer--open' : ''}`}>
                <div className="header-container">
                    <h3>Previous Puzzles</h3>
                    <button className="close-button" onClick={handleCloseClick}>
                        <img src="images/circle_x.png"></img>
                    </button>
                </div>
                <div className="elements-container">
                    {props.data.map((puzzle) => (
                        <div className="puzzle-side-drawer-element">
                            <button className="drawer-item-clickable" onClick={props.onDateClick}>
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