/* tslint:disable */
/* eslint-disable */
/**
 * Initialize the WASM module
 */
export function main(): void;
/**
 * Statistics about the current simplicial complex
 */
export class ComplexStats {
  free(): void;
  constructor(vertices: number, edges: number, triangles: number);
  readonly vertices: number;
  readonly edges: number;
  readonly triangles: number;
}
/**
 * Main demo structure that manages the interactive Vietoris-Rips visualization
 */
export class VietorisRipsDemo {
  free(): void;
  /**
   * Create a new demo instance
   */
  constructor(canvas_width: number, canvas_height: number);
  /**
   * Add a point at the given coordinates
   */
  add_point(x: number, y: number): void;
  /**
   * Remove the point closest to the given coordinates (within threshold)
   */
  remove_point(x: number, y: number): boolean;
  /**
   * Set the epsilon value for the Vietoris-Rips complex
   */
  set_epsilon(epsilon: number): void;
  /**
   * Get the current epsilon value
   */
  get_epsilon(): number;
  /**
   * Get the number of points
   */
  point_count(): number;
  /**
   * Clear all points
   */
  clear_points(): void;
  /**
   * Build the Vietoris-Rips complex and return statistics
   */
  get_complex_stats(): ComplexStats;
  /**
   * Render the current state to the canvas
   */
  render(context: CanvasRenderingContext2D): void;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_complexstats_free: (a: number, b: number) => void;
  readonly complexstats_new: (a: number, b: number, c: number) => number;
  readonly complexstats_vertices: (a: number) => number;
  readonly complexstats_edges: (a: number) => number;
  readonly complexstats_triangles: (a: number) => number;
  readonly __wbg_vietorisripsdemo_free: (a: number, b: number) => void;
  readonly vietorisripsdemo_new: (a: number, b: number) => number;
  readonly vietorisripsdemo_add_point: (a: number, b: number, c: number) => void;
  readonly vietorisripsdemo_remove_point: (a: number, b: number, c: number) => number;
  readonly vietorisripsdemo_set_epsilon: (a: number, b: number) => void;
  readonly vietorisripsdemo_get_epsilon: (a: number) => number;
  readonly vietorisripsdemo_point_count: (a: number) => number;
  readonly vietorisripsdemo_clear_points: (a: number) => void;
  readonly vietorisripsdemo_get_complex_stats: (a: number) => number;
  readonly vietorisripsdemo_render: (a: number, b: any) => void;
  readonly main: () => void;
  readonly __wbindgen_exn_store: (a: number) => void;
  readonly __externref_table_alloc: () => number;
  readonly __wbindgen_export_2: WebAssembly.Table;
  readonly __wbindgen_free: (a: number, b: number, c: number) => void;
  readonly __wbindgen_malloc: (a: number, b: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
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
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
