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

  const [agentList, setAgentList] = useState<{ id: string; state: string }[]>([]);

  useEffect(() => {
    if (!isWasmInitialized) {
      initSync()
        .then(() => setIsWasmInitialized(true))
        .catch(console.error);
    }
  }, [initSync, isWasmInitialized]);

  const updateAgentList = useCallback(() => {
    if (!simulation) return;
    try {
      const namesJson = simulation.agentNames();
      const names: string[] = JSON.parse(namesJson);
      setAgentList(
        names.map((name) => ({
          id: name,
          state: simulation.agentState(name),
        }))
      );
    } catch (error) {
      console.error("Failed to parse agent names:", error);
    }
  }, [simulation]);

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

      const isDark = document.documentElement.classList.contains("dark");

      // Clear canvas
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

      for (const agent of agents) {
        ctx.beginPath();
        ctx.arc(agent.x, agent.y, 8, 0, 2 * Math.PI);
        if (agent.type.toLowerCase().includes("leader")) {
          ctx.fillStyle = "#ef4444"; // Red (from site theme gradient)
        } else {
          ctx.fillStyle = "#3b82f6"; // Blue (from site theme gradient)
        }
        ctx.fill();
        ctx.strokeStyle = isDark ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.1)"; // subtle border
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.fillStyle = isDark ? "#e5e7eb" : "#374151";
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
    updateAgentList();
    requestRef.current = requestAnimationFrame(loop);
  }, [drawDemo, updateAgentList]);

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

  const handleStartAgent = useCallback(
    (id: string) => {
      if (!simulation) return;
      simulation.startAgent(id);
      updateAgentList();
    },
    [simulation, updateAgentList]
  );

  const handlePauseAgent = useCallback(
    (id: string) => {
      if (!simulation) return;
      simulation.pauseAgent(id);
      updateAgentList();
    },
    [simulation, updateAgentList]
  );

  const handleStopAgent = useCallback(
    (id: string) => {
      if (!simulation) return;
      simulation.stopAgent(id);
      updateAgentList();
    },
    [simulation, updateAgentList]
  );

  const handleProcessAgent = useCallback(
    (id: string) => {
      if (!simulation) return;
      simulation.processAgent(id);
      updateAgentList();
    },
    [simulation, updateAgentList]
  );

  const handleRemoveAgent = useCallback(
    (id: string) => {
      if (!simulation) return;
      simulation.removeAgent(id);
      updateAgentList();
    },
    [simulation, updateAgentList]
  );

  return (
    <div className="flex flex-col gap-8 items-center justify-center">
      <div className="text-sm">Leader-Follower Simulation</div>

      <div className="flex flex-col lg:flex-row gap-4 items-start justify-center w-full px-4">
        {/* Main Canvas Area */}
        <div className="flex-grow w-full">
          <div
            ref={canvasWrapperRef}
            className="w-full h-[650px] border border-gray-200 dark:border-white/10 rounded-md overflow-hidden bg-white dark:bg-black/40 dark:backdrop-blur-md shadow-sm"
          >
            <canvas id="canvas" ref={canvasRef} className="block" />
          </div>
        </div>

        {/* Sidebar Controls */}
        <div className="flex flex-col gap-6 w-full lg:w-[420px] p-6 border border-gray-200 dark:border-white/10 rounded-md bg-white dark:bg-black/40 dark:backdrop-blur-md h-[650px] flex-shrink-0 shadow-sm">
          {/* Global Controls */}
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-200 tracking-wider">
              Simulation Controls
            </h3>
              <button
                onClick={handleAddLeader}
                className="cursor-pointer w-full py-2 px-4 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50 text-sm shadow-[0_0_15px_rgba(239,68,68,0.3)] transition-all"
              >
                Add Leader
              </button>
              <button
                onClick={handleAddFollower}
                className="cursor-pointer w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 text-sm shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all"
              >
                Add Follower
              </button>
            <div className="text-xs text-gray-600 dark:text-gray-400 p-3 border border-gray-200 dark:border-white/10 rounded-sm bg-gray-50 dark:bg-white/5 text-center mt-2">
              Followers will automatically follow nearby leaders.
            </div>
          </div>

          <button
            onClick={handleReset}
            className="cursor-pointer w-full py-2 px-4 bg-gray-100 dark:bg-white/5 text-gray-900 dark:text-gray-300 border border-gray-200 dark:border-white/10 rounded-md hover:bg-gray-200 dark:hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 text-sm transition-all"
          >
            Clear All Agents
          </button>

          {/* Agent Information Panel */}
          <div className="flex flex-col gap-3 h-full min-h-0">
            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-200 tracking-wider">
              Active Agents ({agentList.length})
            </h3>
            <div className="w-full border border-gray-200 dark:border-white/10 rounded-sm bg-white dark:bg-transparent overflow-hidden flex flex-col min-h-0 flex-grow">
              <div className="overflow-y-auto w-full p-2 space-y-2 h-[100px] flex-grow">
                {agentList.length === 0 ? (
                  <div className="text-sm text-gray-500 p-4 text-center h-full flex items-center justify-center">
                    No agents in the simulation. Add some!
                  </div>
                ) : (
                  agentList.map((agent) => (
                    <div
                      key={agent.id}
                      className="flex flex-wrap md:flex-nowrap justify-between items-center p-3 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded hover:bg-gray-100 dark:hover:bg-white/10 transition-colors gap-2"
                    >
                      <div className="flex items-center gap-3 pr-2">
                        <div
                          className={`min-w-2 min-h-2 rounded-full ${agent.id.includes("Leader") ? "bg-red-500" : "bg-blue-500"}`}
                        />
                        <span
                          className="text-sm font-medium text-gray-900 dark:text-gray-200 w-20 truncate"
                          title={agent.id}
                        >
                          {agent.id}
                        </span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full border ${
                            agent.state === "Running"
                              ? "bg-green-100 text-green-800 border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20"
                              : agent.state === "Paused"
                                ? "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-500/10 dark:text-yellow-400 dark:border-yellow-500/20"
                                : "bg-gray-100 text-gray-800 border-gray-200 dark:bg-white/10 dark:text-gray-300 dark:border-white/20"
                          }`}
                        >
                          {agent.state}
                        </span>
                      </div>

                    <div className="flex gap-1.5 ml-auto flex-shrink-0">
                      {agent.state === "Running" && (
                        <>
                          <button
                            onClick={() => handlePauseAgent(agent.id)}
                            className="cursor-pointer px-2 py-1 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 dark:bg-yellow-500/10 dark:hover:bg-yellow-500/20 dark:text-yellow-400 text-xs rounded border border-yellow-200 dark:border-yellow-500/20 transition-colors"
                          >
                            Pause
                          </button>
                          <button
                            onClick={() => handleStopAgent(agent.id)}
                            className="cursor-pointer px-2 py-1 bg-red-100 hover:bg-red-200 text-red-800 dark:bg-red-500/10 dark:hover:bg-red-500/20 dark:text-red-400 text-xs rounded border border-red-200 dark:border-red-500/20 transition-colors"
                          >
                            Stop
                          </button>
                        </>
                      )}

                      {agent.state === "Paused" && (
                        <>
                          <button
                            onClick={() => handleStartAgent(agent.id)}
                            className="cursor-pointer px-2 py-1 bg-green-100 hover:bg-green-200 text-green-800 dark:bg-green-500/10 dark:hover:bg-green-500/20 dark:text-green-400 text-xs rounded border border-green-200 dark:border-green-500/20 transition-colors"
                          >
                            Start
                          </button>
                          <button
                            onClick={() => handleStopAgent(agent.id)}
                            className="cursor-pointer px-2 py-1 bg-red-100 hover:bg-red-200 text-red-800 dark:bg-red-500/10 dark:hover:bg-red-500/20 dark:text-red-400 text-xs rounded border border-red-200 dark:border-red-500/20 transition-colors"
                          >
                            Stop
                          </button>
                        </>
                      )}

                      {(agent.state === "Unprocessed" ||
                        agent.state === "Unknown" ||
                        agent.state === "Ready") && (
                        <button
                          onClick={() => handleProcessAgent(agent.id)}
                          className="cursor-pointer px-2 py-1 bg-blue-100 hover:bg-blue-200 text-blue-800 dark:bg-blue-500/10 dark:hover:bg-blue-500/20 dark:text-blue-400 text-xs rounded border border-blue-200 dark:border-blue-500/20 transition-colors"
                        >
                          Process
                        </button>
                      )}

                      <button
                        onClick={() => handleRemoveAgent(agent.id)}
                        className="cursor-pointer p-1 bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-white/5 dark:hover:bg-white/10 dark:text-gray-300 text-xs rounded border border-gray-300 dark:border-white/10 transition-colors flex items-center justify-center"
                        title="Remove"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M18 6 6 18" />
                          <path d="m6 6 12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))
              )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
