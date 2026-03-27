import './stylesheets/app.css'

function GuessVisualizer ({ guessesRemaining }: { guessesRemaining: number }) {
    return (
        <div className="guesses-container">
            <h1>Guesses Remaining:</h1>
            <div className='hearts-container'>
                {Array.from({ length: guessesRemaining}).map((_, i) => (
                    <img key={i} className="heart-img" src ="images/heart.png" alt="guess"/>
                ))}
            </div>
        </div>
    )
}

export default GuessVisualizer