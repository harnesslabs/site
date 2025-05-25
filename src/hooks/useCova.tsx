import { VietorisRipsDemo } from "@/playground-wasm/cova";
import { useState, useEffect } from "react";

export interface CovaWasmExport {
  default: () => Promise<void>;
  VietorisRipsDemo: typeof VietorisRipsDemo;
}

export default function useCova() {
  const [wasm, setWasm] = useState<CovaWasmExport | null>(null);
  useEffect(() => {
    async function loadWasm() {
      try {
        const wasmModule = await import("../playground-wasm/cova");
        setWasm(wasmModule as unknown as CovaWasmExport);
      } catch (err) {
        console.error("Failed to load WASM:", err);
      }
    }
    loadWasm();
  }, []);
  return wasm;
}
