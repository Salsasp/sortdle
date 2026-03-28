import { type SortInstruction } from "../utils/types";

export function getSortInstructions(sortType: string, numbers: number[], signal: AbortSignal): SortInstruction[] {
    switch (sortType) {
        case "bubble":
            return bubbleSort(numbers, signal);
        case "selection":
            return selectionSort(numbers, signal);
        case "insertion":
            return insertionSort(numbers, signal);
        case "merge":
            return mergeSort(numbers, signal);
        case "quick":
            return quickSort(numbers, signal);
        case "heap":
            return heapSort(numbers, signal);
        case "counting":
            return countingSort(numbers, signal);
        case "radix":
            return radixSort(numbers, signal);
        case "bucket":
            return bucketSort(numbers, signal);
        default:
            throw new Error('invalid sort type')
    }
}

function bubbleSort(numbers: number[], signal: AbortSignal): SortInstruction[] {
    let swapped = false;
    let sortInstructions = [];
    let numbersCopy = [...numbers];
    for (let i = 0; i < numbers.length - 1; i++) {
        swapped = false;
        for (let j = 0; j < numbers.length - i - 1; j++) {
            if (signal.aborted) return sortInstructions;

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

// All functions below this point were vibe coded - I have no shame >:)

// Finds the minimum element in the unsorted portion and swaps it into place.
function selectionSort(numbers: number[], signal: AbortSignal): SortInstruction[] {
    const sortInstructions: SortInstruction[] = [];
    const numbersCopy = [...numbers];
 
    for (let i = 0; i < numbersCopy.length - 1; i++) {
        let minIndex = i;
        for (let j = i + 1; j < numbersCopy.length; j++) {
            if (signal.aborted) return sortInstructions;

            if (numbersCopy[j] < numbersCopy[minIndex]) {
                minIndex = j;
            }
        }
        if (minIndex !== i) {
            sortInstructions.push({ action: 'SWAP', indexFrom: i, indexTo: minIndex });
            const temp = numbersCopy[minIndex];
            numbersCopy[minIndex] = numbersCopy[i];
            numbersCopy[i] = temp;
        }
    }
    return sortInstructions;
}
 
// Builds a sorted portion by shifting each new element leftward into its correct position.
function insertionSort(numbers: number[], signal: AbortSignal): SortInstruction[] {
    const sortInstructions: SortInstruction[] = [];
    const numbersCopy = [...numbers];
 
    for (let i = 1; i < numbersCopy.length; i++) {
        let j = i;
        while (j > 0 && numbersCopy[j - 1] > numbersCopy[j]) {
            if (signal.aborted) return sortInstructions;

            sortInstructions.push({ action: 'SWAP', indexFrom: j - 1, indexTo: j });
            const temp = numbersCopy[j];
            numbersCopy[j] = numbersCopy[j - 1];
            numbersCopy[j - 1] = temp;
            j--;
        }
    }
    return sortInstructions;
}
 
// Recursively divides the array in half and merges the halves back in sorted order.
// Merging is expressed as a sequence of SWAPs that move elements into their correct positions.
function mergeSort(numbers: number[], signal: AbortSignal): SortInstruction[] {
    const sortInstructions: SortInstruction[] = [];
    const numbersCopy = [...numbers];
 
    function merge(arr: number[], left: number, mid: number, right: number) {
        const leftArr = arr.slice(left, mid + 1);
        const rightArr = arr.slice(mid + 1, right + 1);
        let i = 0, j = 0, k = left;
 
        while (i < leftArr.length && j < rightArr.length) {
            checkAbort(signal);
            if (leftArr[i] <= rightArr[j]) {
                if (arr[k] !== leftArr[i]) {
                    const swapTarget = arr.indexOf(leftArr[i], k);
                    sortInstructions.push({ action: 'SWAP', indexFrom: k, indexTo: swapTarget });
                    const temp = arr[swapTarget];
                    arr[swapTarget] = arr[k];
                    arr[k] = temp;
                }
                i++;
            } else {
                if (arr[k] !== rightArr[j]) {
                    const swapTarget = arr.indexOf(rightArr[j], k);
                    sortInstructions.push({ action: 'SWAP', indexFrom: k, indexTo: swapTarget });
                    const temp = arr[swapTarget];
                    arr[swapTarget] = arr[k];
                    arr[k] = temp;
                }
                j++;
            }
            k++;
        }
    }
 
    function mergeSortHelper(arr: number[], left: number, right: number) {
        if (left >= right) return;
        const mid = Math.floor((left + right) / 2);
        mergeSortHelper(arr, left, mid);
        mergeSortHelper(arr, mid + 1, right);
        merge(arr, left, mid, right);
    }

    mergeSortHelper(numbersCopy, 0, numbersCopy.length - 1);
    return sortInstructions;
}
 
// Partitions the array around a pivot, then recursively sorts each partition.
function quickSort(numbers: number[], signal: AbortSignal): SortInstruction[] {
    const sortInstructions: SortInstruction[] = [];
    const numbersCopy = [...numbers];
 
    function partition(arr: number[], low: number, high: number, signal: AbortSignal): number {
        const pivot = arr[high];
        let i = low - 1;
        for (let j = low; j < high; j++) {
            if (arr[j] <= pivot) {
                i++;
                if (i !== j) {
                    checkAbort(signal);
                    sortInstructions.push({ action: 'SWAP', indexFrom: i, indexTo: j });
                    const temp = arr[i];
                    arr[i] = arr[j];
                    arr[j] = temp;
                }
            }
        }
        if (i + 1 !== high) {
            sortInstructions.push({ action: 'SWAP', indexFrom: i + 1, indexTo: high });
            const temp = arr[i + 1];
            arr[i + 1] = arr[high];
            arr[high] = temp;
        }
        return i + 1;
    }
 
    function quickSortHelper(arr: number[], low: number, high: number, signal: AbortSignal) {
        if (low >= high) return;
        const pivotIndex = partition(arr, low, high, signal);
        quickSortHelper(arr, low, pivotIndex - 1, signal);
        quickSortHelper(arr, pivotIndex + 1, high, signal);
    }
 
    quickSortHelper(numbersCopy, 0, numbersCopy.length - 1, signal);
    return sortInstructions;
}
 
// Builds a max-heap, then repeatedly extracts the maximum to produce a sorted array.
function heapSort(numbers: number[], signal: AbortSignal): SortInstruction[] {
    const sortInstructions: SortInstruction[] = [];
    const numbersCopy = [...numbers];
    const n = numbersCopy.length;
 
    function heapify(arr: number[], size: number, root: number, signal: AbortSignal) {
        let largest = root;
        const left = 2 * root + 1;
        const right = 2 * root + 2;
        if (left < size && arr[left] > arr[largest]) largest = left;
        if (right < size && arr[right] > arr[largest]) largest = right;
        if (largest !== root) {
            checkAbort(signal);
            sortInstructions.push({ action: 'SWAP', indexFrom: root, indexTo: largest });
            const temp = arr[root];
            arr[root] = arr[largest];
            arr[largest] = temp;
            heapify(arr, size, largest, signal);
        }
    }
 
    // Build max-heap
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        heapify(numbersCopy, n, i, signal);
    }
 
    // Extract elements from heap one by one
    for (let i = n - 1; i > 0; i--) {
        sortInstructions.push({ action: 'SWAP', indexFrom: 0, indexTo: i });
        const temp = numbersCopy[0];
        numbersCopy[0] = numbersCopy[i];
        numbersCopy[i] = temp;
        heapify(numbersCopy, i, 0, signal);
    }
 
    return sortInstructions;
}
 
// Counts occurrences of each value, then reconstructs the array in sorted order via SWAPs.
function countingSort(numbers: number[], signal: AbortSignal): SortInstruction[] {
    const sortInstructions: SortInstruction[] = [];
    const numbersCopy = [...numbers];
 
    const max = Math.max(...numbersCopy);
    const min = Math.min(...numbersCopy);
    const range = max - min + 1;
    const count = new Array(range).fill(0);
 
    for (const num of numbersCopy) count[num - min]++;
 
    // Build the target sorted array
    const sorted: number[] = [];
    for (let i = 0; i < range; i++) {
        for (let j = 0; j < count[i]; j++) {
            sorted.push(i + min);
        }
    }
 
    // Replay as SWAPs on numbersCopy to match the sorted order
    for (let i = 0; i < numbersCopy.length; i++) {
        if (numbersCopy[i] !== sorted[i]) {
            if (signal.aborted) return sortInstructions;

            const swapTarget = numbersCopy.indexOf(sorted[i], i);
            sortInstructions.push({ action: 'SWAP', indexFrom: i, indexTo: swapTarget });
            const temp = numbersCopy[swapTarget];
            numbersCopy[swapTarget] = numbersCopy[i];
            numbersCopy[i] = temp;
        }
    }
 
    return sortInstructions;
}
 
// Sorts by processing one digit at a time from least significant to most significant.
function radixSort(numbers: number[], signal: AbortSignal): SortInstruction[] {
    const sortInstructions: SortInstruction[] = [];
    const numbersCopy = [...numbers];
 
    const max = Math.max(...numbersCopy);
    const maxDigits = Math.floor(Math.log10(max)) + 1;
 
    for (let digit = 0; digit < maxDigits; digit++) {
        const divisor = Math.pow(10, digit);
 
        // Build sorted order for this digit pass
        const buckets: number[][] = Array.from({ length: 10 }, () => []);
        for (const num of numbersCopy) {
            buckets[Math.floor(num / divisor) % 10].push(num);
        }
        const sorted = buckets.flat();
 
        // Replay as SWAPs
        for (let i = 0; i < numbersCopy.length; i++) {
            if (numbersCopy[i] !== sorted[i]) {
                if (signal.aborted) return sortInstructions;

                const swapTarget = numbersCopy.indexOf(sorted[i], i);
                sortInstructions.push({ action: 'SWAP', indexFrom: i, indexTo: swapTarget });
                const temp = numbersCopy[swapTarget];
                numbersCopy[swapTarget] = numbersCopy[i];
                numbersCopy[i] = temp;
            }
        }
    }
 
    return sortInstructions;
}
 
// Distributes elements into buckets by value range, sorts each bucket, then concatenates.
function bucketSort(numbers: number[], signal: AbortSignal): SortInstruction[] {
    const sortInstructions: SortInstruction[] = [];
    const numbersCopy = [...numbers];
    const n = numbersCopy.length;
 
    const max = Math.max(...numbersCopy);
    const min = Math.min(...numbersCopy);
    const range = max - min + 1;
 
    const buckets: number[][] = Array.from({ length: n }, () => []);
    for (const num of numbersCopy) {
        const bucketIndex = Math.floor(((num - min) / range) * n);
        buckets[Math.min(bucketIndex, n - 1)].push(num);
    }
 
    // Sort each bucket and build the target sorted array
    const sorted = buckets.flatMap(bucket => bucket.sort((a, b) => a - b));
 
    // Replay as SWAPs
    for (let i = 0; i < numbersCopy.length; i++) {
        if (numbersCopy[i] !== sorted[i]) {
            if (signal.aborted) return sortInstructions;
            
            const swapTarget = numbersCopy.indexOf(sorted[i], i);
            sortInstructions.push({ action: 'SWAP', indexFrom: i, indexTo: swapTarget });
            const temp = numbersCopy[swapTarget];
            numbersCopy[swapTarget] = numbersCopy[i];
            numbersCopy[i] = temp;
        }
    }
 
    return sortInstructions;
}

function checkAbort(signal: AbortSignal) {
  if (signal.aborted) throw new DOMException('Sort aborted', 'AbortError');
}