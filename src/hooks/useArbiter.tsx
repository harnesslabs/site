import { Simulation } from "@/playground-wasm/arbiter";
import { useState, useEffect } from "react";

export interface ArbiterWasmExport {
  default: () => Promise<void>;
  Simulation: typeof Simulation;
  get_agent_positions: () => string;
}

export default function useArbiter() {
  const [wasm, setWasm] = useState<ArbiterWasmExport | null>(null);
  useEffect(() => {
    async function loadWasm() {
      try {
        const wasmModule = await import("../playground-wasm/arbiter");
        setWasm(wasmModule as unknown as ArbiterWasmExport);
      } catch (err) {
        console.error("Failed to load WASM:", err);
      }
    }
    loadWasm();
  }, []);
  return wasm;
}
