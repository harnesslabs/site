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
      demo.render(ctx);
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

    return () => {
      resizeObserver.unobserve(wrapperElement);
      resizeObserver.disconnect();
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
        <div
          ref={canvasWrapperRef}
          className="flex-grow w-full h-[500px] border border-gray-200 rounded-md overflow-hidden bg-white"
        >
          <canvas
            id="canvas"
            ref={canvasRef}
            // width={600}
            // height={498}
            className="cursor-crosshair block"
          />
        </div>
        <div className="flex flex-col gap-6 w-full lg:w-72 p-6 border border-gray-200 rounded-md bg-white h-[500px] flex-shrink-0">
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-medium text-gray-700 tracking-wider">Distance Threshold</h3>
            <div className="flex flex-col gap-2 items-start">
              <label htmlFor="epsilonSlider" className="text-sm text-gray-600">
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
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gray-700"
              />
              <div className="self-center text-lg font-medium text-gray-800 mt-1">{epsilon}</div>
            </div>
            <div className="text-xs text-gray-500 p-3 border border-gray-200 rounded-sm bg-gray-50 text-center">
              Gray circles show the ε-neighborhood around each point
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-medium text-gray-700 tracking-wider">Complex Statistics</h3>
            <div className="bg-gray-50 border border-gray-200 rounded-sm">
              <div className="flex justify-between items-center p-3 border-b border-gray-200">
                <span className="text-sm text-gray-600">Vertices (0-simplices)</span>
                <span className="text-sm font-semibold text-gray-800">
                  {complexStats?.vertices ?? 0}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 border-b border-gray-200">
                <span className="text-sm text-gray-600">Edges (1-simplices)</span>
                <span className="text-sm font-semibold text-gray-800">
                  {complexStats?.edges ?? 0}
                </span>
              </div>
              <div className="flex justify-between items-center p-3">
                <span className="text-sm text-gray-600">Triangles (2-simplices)</span>
                <span className="text-sm font-semibold text-gray-800">
                  {complexStats?.triangles ?? 0}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={handleReset}
            className="w-full py-2 px-4 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 text-sm"
          >
            Clear Points
          </button>
        </div>
      </div>
    </div>
  );
}
