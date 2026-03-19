import { type SortInstruction } from "../utils/types";

export function getSortInstructions(sortType: string, numbers: number[]): SortInstruction[] {
    switch (sortType) {
        case "bubble":
            return bubbleSort(numbers);
        default:
            throw new Error('invalid sort type')
    }
}

export function bubbleSort(numbers: number[]): SortInstruction[] {
    let swapped = false;
    let sortInstructions = [];
    let numbersCopy = [...numbers];
    for (let i = 0; i < numbers.length - 1; i++) {
        swapped = false;
        for (let j = 0; j < numbers.length - i - 1; j++) {
            if (numbersCopy[j] > numbersCopy[j+1]) {
                let sortInstruction: SortInstruction = {action:'SWAP', indexFrom:j, indexTo:j+1};
                sortInstructions.push(sortInstruction);
                const temp = numbersCopy[j+1];
                numbersCopy[j+1] = numbersCopy[j];
                numbersCopy[j] = temp;
                swapped = true;
            }
        }
        if (!swapped) break;
    }
    return sortInstructions;
}

export function selectionSort(numbers: number[]): number[] {
  return numbers;
}

export function insertionSort(numbers: number[]): number[] {
  return numbers;
}

export function mergeSort(numbers: number[]): number[] {
  return numbers;
}

export function quickSort(numbers: number[]): number[] {
  return numbers;
}

export function heapSort(numbers: number[]): number[] {
  return numbers;
}

export function countingSort(numbers: number[]): number[] {
  return numbers;
}

export function radixSort(numbers: number[]): number[] {
  return numbers;
}

export function bucketSort(numbers: number[]): number[] {
  return numbers;
}