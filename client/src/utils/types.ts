export type SelectorProps = {
    label: string,
    id: string,
    options: AlgorithmSelectorOption[]
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