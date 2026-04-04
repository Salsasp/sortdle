import { useParams } from 'react-router-dom';
import App from '../App';

function PuzzlePage() {
    const { date } = useParams();
    return (
        <App puzzleDateArg={date}></App>
    );
}

export default PuzzlePage;