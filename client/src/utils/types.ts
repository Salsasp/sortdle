export type SelectorProps = {
    id: string;
    options: AlgorithmSelectorOption[];
    value: string;
    onChange: (val: string) => void;
}

export type SortCanvasProps = {
    numbers: number[],
    percentUncovered: number
}

export type SortInstruction = {
    action: string,
    indexFrom: number,
    indexTo: number
};

export type StringMap = Record<string, string>;

export type AlgorithmSelectorOption = {
    value: string
    label: string
};