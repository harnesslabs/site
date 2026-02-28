"use client";

import { projects } from "@/data";
import { ProjectHeader } from "../_components/project-header";
import useArbiter, { ArbiterWasmExport } from "@/hooks/useArbiter";
import { Simulation as SimulationType } from "@/playground-wasm/arbiter";
import { useCallback, useEffect, useRef, useState } from "react";

export default function Page() {
  const project = projects.find((project) => project.slug === "arbiter");
  const arbiter = useArbiter();

  if (!project) {
    return <div>Project not found</div>;
  }

  if (!arbiter) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col gap-10">
      <ProjectHeader project={project} />
      <Demo arbiter={arbiter} />
    </div>
  );
}

function Demo({ arbiter }: { arbiter: ArbiterWasmExport }) {
  const { default: initSync, Simulation, get_agent_positions } = arbiter;

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasWrapperRef = useRef<HTMLDivElement>(null);
  const [simulation, setSimulation] = useState<SimulationType | null>(null);
  const [isWasmInitialized, setIsWasmInitialized] = useState(false);
  const requestRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (!isWasmInitialized) {
      initSync()
        .then(() => setIsWasmInitialized(true))
        .catch(console.error);
    }
  }, [initSync, isWasmInitialized]);

  const drawDemo = useCallback(() => {
    if (!simulation || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    try {
      simulation.simulation_tick();

      const positionsStr = get_agent_positions();
      const agents = JSON.parse(positionsStr) as {
        id: string;
        type: string;
        x: number;
        y: number;
      }[];

      // Clear canvas
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

      ctx.fillStyle = "#f9fafb"; // Light gray background
      ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);

      for (const agent of agents) {
        ctx.beginPath();
        ctx.arc(agent.x, agent.y, 8, 0, 2 * Math.PI);
        if (agent.type.includes("Leader")) {
          ctx.fillStyle = "#ef4444"; // Red for leader
        } else {
          ctx.fillStyle = "#3b82f6"; // Blue for follower
        }
        ctx.fill();
        ctx.strokeStyle = "#1f2937"; // Dark outline
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.fillStyle = "#1f2937";
        ctx.font = "10px sans-serif";
        ctx.textAlign = "center";

        // draw label below node
        ctx.fillText(agent.id, agent.x, agent.y + 18);
      }
    } catch (error) {
      console.error("Render error:", error);
    }
  }, [simulation, get_agent_positions]);

  const loop = useCallback(() => {
    drawDemo();
    requestRef.current = requestAnimationFrame(loop);
  }, [drawDemo]);

  useEffect(() => {
    if (simulation) {
      requestRef.current = requestAnimationFrame(loop);
    }
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [simulation, loop]);

  useEffect(() => {
    const canvasElement = canvasRef.current;
    const wrapperElement = canvasWrapperRef.current;

    if (!isWasmInitialized || !canvasElement || !wrapperElement) {
      return;
    }

    if (!simulation) {
      const { width, height } = wrapperElement.getBoundingClientRect();
      if (width > 0 && height > 0) {
        canvasElement.width = width;
        canvasElement.height = height;

        const newSimulation = new Simulation(width, height);
        setSimulation(newSimulation);
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

    resizeObserver.observe(wrapperElement);

    return () => {
      resizeObserver.unobserve(wrapperElement);
      resizeObserver.disconnect();
    };
  }, [isWasmInitialized, Simulation, simulation, setSimulation]);

  const handleAddLeader = useCallback(() => {
    if (!simulation || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = Math.random() * rect.width;
    const y = Math.random() * rect.height;
    simulation.add_agent(x, y, true);
  }, [simulation]);

  const handleAddFollower = useCallback(() => {
    if (!simulation || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = Math.random() * rect.width;
    const y = Math.random() * rect.height;
    simulation.add_agent(x, y, false);
  }, [simulation]);

  const handleReset = useCallback(() => {
    if (!simulation) return;
    simulation.clear_all_agents();
  }, [simulation]);

  return (
    <div className="flex flex-col gap-8 items-center justify-center">
      <div className="text-sm">Leader-Follower Simulation</div>
      <div className="flex flex-col lg:flex-row gap-4 items-start justify-center w-full px-4">
        <div
          ref={canvasWrapperRef}
          className="flex-grow w-full h-[500px] border border-gray-200 rounded-md overflow-hidden bg-white"
        >
          <canvas id="canvas" ref={canvasRef} className="block" />
        </div>
        <div className="flex flex-col gap-6 w-full lg:w-72 p-6 border border-gray-200 rounded-md bg-white h-[500px] flex-shrink-0">
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-medium text-gray-700 tracking-wider">Controls</h3>
            <button
              onClick={handleAddLeader}
              className="w-full py-2 px-4 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50 text-sm"
            >
              Add Leader
            </button>
            <button
              onClick={handleAddFollower}
              className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 text-sm"
            >
              Add Follower
            </button>
            <div className="text-xs text-gray-500 p-3 border border-gray-200 rounded-sm bg-gray-50 text-center mt-2">
              Followers will automatically follow nearby leaders.
            </div>
          </div>

          <button
            onClick={handleReset}
            className="w-full py-2 px-4 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 text-sm mt-auto"
          >
            Clear All Agents
          </button>
        </div>
      </div>
    </div>
  );
}
