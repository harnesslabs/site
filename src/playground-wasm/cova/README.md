# Vietoris-Rips Complex Web Demo

An interactive web demonstration of Vietoris-Rips complexes using the `cova` library.

## Features

- **Interactive Point Placement**: Click to add points, right-click to remove
- **Real-time Complex Computation**: Uses `cova` to compute Vietoris-Rips complexes
- **Visual Simplicial Complex**: See vertices, epsilon bubbles, edges, and triangles
- **Adjustable Epsilon**: Slider to control the distance threshold

## Project Structure

```
vietoris_web/
├── src/
│   ├── lib.rs          # WASM library using cova
│   └── main.rs         # Simple web server binary
├── index.html          # Web interface
└── Cargo.toml          # Dependencies and configuration
```

## Quick Start

1. **Build WASM module**:
   ```bash
   wasm-pack build --target web
   ```

2. **Start the server**:
   ```bash
   cargo run --bin server
   ```

3. **Open browser**: Navigate to http://localhost:3030

### Dependencies

The project uses target-specific dependencies:

- **Core**: `cova` - The unified mathematical library
- **Server** (native only): `tokio`, `warp` - Async web server
- **WASM** (wasm32 only): `wasm-bindgen`, `web-sys` - WebAssembly bindings

## Usage

1. Click anywhere on the canvas to add points
2. Right-click near a point to remove it
3. Adjust the epsilon slider to see how the complex changes
4. Watch as triangles form when three points are within epsilon distance

The demo showcases how `cova` computes Vietoris-Rips complexes in real-time! 