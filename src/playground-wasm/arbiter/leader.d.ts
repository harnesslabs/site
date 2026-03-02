/* tslint:disable */
/* eslint-disable */

export class Simulation {
  free(): void;
  [Symbol.dispose](): void;
  /**
   * Add an agent at the specified position
   */
  add_agent(x: number, y: number, is_leader: boolean): string;
  agentNames(): string;
  agentState(agent_id: string): string;
  /**
   * Clear all agents from shared state and reset counters
   */
  clear_all_agents(): void;
  /**
   * Initialize the leader-follower simulation with shared state
   */
  constructor(canvas_width: number, canvas_height: number);
  pauseAgent(agent_id: string): boolean;
  processAgent(agent_id: string): boolean;
  removeAgent(agent_id: string): boolean;
  /**
   * Remove a single agent from shared state
   */
  remove_single_agent(agent_id: string): void;
  /**
   * Step the simulation forward by one tick
   */
  simulation_tick(): void;
  startAgent(agent_id: string): boolean;
  stopAgent(agent_id: string): boolean;
}

/**
 * Get all agent positions for rendering (called from JavaScript)
 */
export function get_agent_positions(): string;

/**
 * Initialize the WASM module
 */
export function main(): void;

/**
 * Entry point invoked by JavaScript in a worker.
 */
export function task_worker_entry_point(ptr: number): void;

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_simulation_free: (a: number, b: number) => void;
  readonly get_agent_positions: () => [number, number];
  readonly simulation_add_agent: (a: number, b: number, c: number, d: number) => [number, number];
  readonly simulation_agentNames: (a: number) => [number, number];
  readonly simulation_agentState: (a: number, b: number, c: number) => [number, number];
  readonly simulation_clear_all_agents: (a: number) => void;
  readonly simulation_new: (a: number, b: number) => number;
  readonly simulation_pauseAgent: (a: number, b: number, c: number) => number;
  readonly simulation_processAgent: (a: number, b: number, c: number) => number;
  readonly simulation_removeAgent: (a: number, b: number, c: number) => number;
  readonly simulation_remove_single_agent: (a: number, b: number, c: number) => void;
  readonly simulation_simulation_tick: (a: number) => void;
  readonly simulation_startAgent: (a: number, b: number, c: number) => number;
  readonly simulation_stopAgent: (a: number, b: number, c: number) => number;
  readonly main: () => void;
  readonly task_worker_entry_point: (a: number) => [number, number];
  readonly wasm_bindgen__closure__destroy__h8132ca8bc85db0e6: (a: number, b: number) => void;
  readonly wasm_bindgen__convert__closures_____invoke__h27044cdacfd87b51: (
    a: number,
    b: number,
    c: any
  ) => [number, number];
  readonly __wbindgen_malloc: (a: number, b: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
  readonly __wbindgen_free: (a: number, b: number, c: number) => void;
  readonly __wbindgen_exn_store: (a: number) => void;
  readonly __externref_table_alloc: () => number;
  readonly __wbindgen_externrefs: WebAssembly.Table;
  readonly __externref_table_dealloc: (a: number) => void;
  readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;

/**
 * Instantiates the given `module`, which can either be bytes or
 * a precompiled `WebAssembly.Module`.
 *
 * @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
 *
 * @returns {InitOutput}
 */
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
 * If `module_or_path` is {RequestInfo} or {URL}, makes a request and
 * for everything else, calls `WebAssembly.instantiate` directly.
 *
 * @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
 *
 * @returns {Promise<InitOutput>}
 */
export default function __wbg_init(
  module_or_path?:
    | { module_or_path: InitInput | Promise<InitInput> }
    | InitInput
    | Promise<InitInput>
): Promise<InitOutput>;
