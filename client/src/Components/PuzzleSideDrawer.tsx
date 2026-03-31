import type { PuzzleSideDrawerProps } from "../utils/types";

function PuzzleSideDrawer (props: PuzzleSideDrawerProps) {

    return (
        <div className="puzzle-side-drawer">
            <div className="elements-container">
                {props.data.map((puzzle) => (
                    <div className="puzzle-side-drawer-element">
                        <button className="drawer-item" onClick={props.onClick}>
                            {puzzle.date}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default PuzzleSideDrawer;