export function sleep(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
      const timeout = setTimeout(resolve, ms);
      signal?.addEventListener('abort', () => {
          clearTimeout(timeout);
          reject(new DOMException('Sort aborted', 'AbortError'));
      }, { once: true });
  });
}