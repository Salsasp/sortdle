export const ALGO_SELECTOR_LABELS = [
    "Bubble Sort",
    "Selection Sort",
    "Insertion Sort",
    "Merge Sort",
    "Quick Sort",
    "Heap Sort",
    "Counting Sort",
    "Radix Sort",
    "Bucket Sort",
 ] as const;

export type AlgorithmSelectorLabel = keyof typeof ALGO_SELECTOR_LABELS;

export const ALGO_SELECTOR_VALUES = [
    "bubble",
    "selection",
    "insertion",
    "merge",
    "quick",
    "heap",
    "counting",
    "radix",
    "bucket",
 ] as const;

export type AlgorithmSelectorValue = keyof typeof ALGO_SELECTOR_VALUES;