export type SelectorProps = {
    id: string,
    options: AlgorithmSelectorOption[],
    value: string,
    onChange: (val: string) => void
}

export type SortCanvasProps = {
    numbers: number[],
    percentUncovered: number
}

export type PuzzleSideDrawerProps = {
    data: PuzzleData[],
    isOpen: boolean,
    setSideDrawerOpen: (value: boolean) => void
}

export type SortInstruction = {
    action: string,
    indexFrom: number,
    indexTo: number
};

export type StringMap = Record<string, string>;

export type AlgorithmSelectorOption = {
    value: string,
    label: string
};

export type PuzzleData = {
    date: string,
    algorithm: string,
    numbers: number[]
}

export type AppProps = {
    puzzleDateArg?: string;
}