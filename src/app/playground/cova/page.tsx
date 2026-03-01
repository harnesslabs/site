"use client";

import { projects } from "@/data";
import { ProjectHeader } from "../_components/project-header";
import useCova, { CovaWasmExport } from "@/hooks/useCova";
import {
  VietorisRipsDemo as VietorisRipsDemoType,
  ComplexStats as ComplexStatsType,
} from "@/playground-wasm/cova";
import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";

export default function Page() {
  const project = projects.find((project) => project.slug === "cova");
  const cova = useCova();

  if (!project) {
    return <div>Project not found</div>;
  }

  if (!cova) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col gap-10">
      <ProjectHeader project={project} />
      <Demo cova={cova} />
    </div>
  );
}

function Demo({ cova }: { cova: CovaWasmExport }) {
  const { default: initSync, VietorisRipsDemo } = cova;

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasWrapperRef = useRef<HTMLDivElement>(null);
  const [demo, setDemo] = useState<VietorisRipsDemoType | null>(null);
  const [epsilon, setEpsilon] = useState(50);
  const [complexStats, setComplexStats] = useState<ComplexStatsType | null>(null);
  const [isWasmInitialized, setIsWasmInitialized] = useState(false);

  useEffect(() => {
    if (!isWasmInitialized) {
      initSync()
        .then(() => setIsWasmInitialized(true))
        .catch(console.error);
    }
  }, [initSync, isWasmInitialized]);

  const drawDemo = useCallback(() => {
    if (!demo || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    try {
      const isDark = document.documentElement.classList.contains("dark");
      demo.render(ctx, isDark);
      setComplexStats(demo.get_complex_stats());
    } catch (error) {
      console.error("Render error:", error);
    }
  }, [demo, setComplexStats]);

  useEffect(() => {
    const canvasElement = canvasRef.current;
    const wrapperElement = canvasWrapperRef.current;

    if (!isWasmInitialized || !canvasElement || !wrapperElement) {
      return;
    }

    if (!demo) {
      const { width, height } = wrapperElement.getBoundingClientRect();
      if (width > 0 && height > 0) {
        canvasElement.width = width;
        canvasElement.height = height;

        const newDemo = new VietorisRipsDemo(width, height);
        setDemo(newDemo);
        setEpsilon(newDemo.get_epsilon());
      }
      return;
    }

    const resizeObserver = new ResizeObserver((entries) => {
      if (!canvasElement) return;
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0) {
          if (canvasElement.width !== width || canvasElement.height !== height) {
            canvasElement.width = width;
            canvasElement.height = height;
            drawDemo();
          }
        }
      }
    });

    const { width, height } = wrapperElement.getBoundingClientRect();
    if (width > 0 && height > 0) {
      if (canvasElement.width !== width || canvasElement.height !== height) {
        canvasElement.width = width;
        canvasElement.height = height;
      }
    }
    drawDemo();

    resizeObserver.observe(wrapperElement);

    const themeObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          drawDemo();
        }
      });
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    return () => {
      resizeObserver.unobserve(wrapperElement);
      resizeObserver.disconnect();
      themeObserver.disconnect();
    };
  }, [isWasmInitialized, VietorisRipsDemo, demo, setDemo, setEpsilon, drawDemo]);

  const performRenderOnCanvas = useCallback(() => {
    drawDemo();
  }, [drawDemo]);

  const handleCanvasClick = useCallback(
    (event: MouseEvent) => {
      if (!demo || !canvasRef.current) {
        return;
      }

      const rect = canvasRef.current.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      try {
        demo.add_point(x, y);
        performRenderOnCanvas();
      } catch (error) {
        console.error(error);
      }
    },
    [demo, performRenderOnCanvas]
  );

  const handleContextMenu = useCallback(
    (event: MouseEvent) => {
      if (!demo || !canvasRef.current) {
        return;
      }

      event.preventDefault();

      const rect = canvasRef.current.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      demo.remove_point(x, y);
      performRenderOnCanvas();
    },
    [demo, performRenderOnCanvas]
  );

  const handleReset = useCallback(() => {
    if (!demo) {
      return;
    }
    demo.clear_points();
    performRenderOnCanvas();
  }, [demo, performRenderOnCanvas]);

  const handleEpsilonChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      if (!demo) {
        return;
      }
      const newEpsilon = Number(event.target.value);
      demo.set_epsilon(newEpsilon);
      setEpsilon(newEpsilon);
      performRenderOnCanvas();
    },
    [demo, performRenderOnCanvas, setEpsilon]
  );

  useEffect(() => {
    const currentCanvas = canvasRef.current;
    if (currentCanvas && demo) {
      currentCanvas.addEventListener("click", handleCanvasClick);
      currentCanvas.addEventListener("contextmenu", handleContextMenu);
      return () => {
        currentCanvas.removeEventListener("click", handleCanvasClick);
        currentCanvas.removeEventListener("contextmenu", handleContextMenu);
      };
    }
  }, [demo, handleCanvasClick, handleContextMenu]);

  return (
    <div className="flex flex-col gap-8 items-center justify-center">
      <div className="text-sm">Vietoris-Rips Complex</div>
      <div className="flex flex-col lg:flex-row gap-4 items-start justify-center w-full px-4">
        {/* Main Canvas Area */}
        <div className="flex-grow w-full">
          <div
            ref={canvasWrapperRef}
            className="w-full h-[650px] border border-gray-200 dark:border-white/10 rounded-md overflow-hidden bg-white dark:bg-black/40 dark:backdrop-blur-md shadow-sm"
          >
            <canvas id="canvas" ref={canvasRef} className="cursor-crosshair block" />
          </div>
        </div>

        {/* Sidebar Controls */}
        <div className="flex flex-col gap-6 w-full lg:w-[420px] p-6 border border-gray-200 dark:border-white/10 rounded-md bg-white dark:bg-black/40 dark:backdrop-blur-md h-[650px] flex-shrink-0 shadow-sm">
          {/* Global Controls */}
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-200 tracking-wider">Distance Threshold</h3>
            <div className="flex flex-col gap-2 items-start">
              <label htmlFor="epsilonSlider" className="text-sm text-gray-600 dark:text-gray-400">
                Epsilon (ε)
              </label>
              <input
                name="epsilonSlider"
                type="range"
                id="epsilonSlider"
                min="10"
                max="150"
                value={epsilon}
                onChange={handleEpsilonChange}
                className="w-full h-2 bg-gray-200 dark:bg-white/20 rounded-lg appearance-none cursor-pointer accent-gray-700 dark:accent-gray-300"
              />
              <div className="self-center text-lg font-medium text-gray-800 dark:text-gray-200 mt-1">{epsilon}</div>
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400 p-3 border border-gray-200 dark:border-white/10 rounded-sm bg-gray-50 dark:bg-white/5 text-center mt-2">
              Gray circles show the ε-neighborhood around each point
            </div>
          </div>

          <button
            onClick={handleReset}
            className="cursor-pointer w-full py-2 px-4 bg-gray-100 dark:bg-white/5 text-gray-900 dark:text-gray-300 border border-gray-200 dark:border-white/10 rounded-md hover:bg-gray-200 dark:hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 text-sm transition-all"
          >
            Clear Points
          </button>

          {/* Statistics Panel */}
          <div className="flex flex-col gap-3 h-full min-h-0">
            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-200 tracking-wider">Complex Statistics</h3>
            <div className="w-full border border-gray-200 dark:border-white/10 rounded-sm bg-white dark:bg-transparent overflow-hidden flex flex-col min-h-0 flex-grow">
              <div className="overflow-y-auto w-full p-2 space-y-2 h-[100px] flex-grow">
                <div className="flex justify-between items-center p-3 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded hover:bg-gray-100 dark:hover:bg-white/10 transition-colors gap-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Vertices (0-simplices)</span>
                  <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                    {complexStats?.vertices ?? 0}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded hover:bg-gray-100 dark:hover:bg-white/10 transition-colors gap-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Edges (1-simplices)</span>
                  <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                    {complexStats?.edges ?? 0}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded hover:bg-gray-100 dark:hover:bg-white/10 transition-colors gap-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Triangles (2-simplices)</span>
                  <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                    {complexStats?.triangles ?? 0}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
