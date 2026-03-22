// Node 22+ exposes a global `localStorage` object that requires
// `--localstorage-file` to function. Without that flag the methods
// are missing, which crashes next-themes' inline script when it
// calls `localStorage.getItem()` during SSR. This polyfill makes
// the server-side localStorage a harmless no-op.

export async function register() {
  if (typeof localStorage !== "undefined" && typeof localStorage.getItem !== "function") {
    const storage = new Map<string, string>();
    Object.defineProperty(globalThis, "localStorage", {
      value: {
        getItem: (key: string) => storage.get(key) ?? null,
        setItem: (key: string, value: string) => storage.set(key, value),
        removeItem: (key: string) => storage.delete(key),
        clear: () => storage.clear(),
        get length() {
          return storage.size;
        },
        key: (index: number) => [...storage.keys()][index] ?? null,
      },
      writable: true,
      configurable: true,
    });
  }
}
