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
        <div className="flex flex-col flex-grow w-full gap-4">
          <div
            ref={canvasWrapperRef}
            className="w-full h-[500px] border border-gray-200 rounded-md overflow-hidden bg-white"
          >
            <canvas id="canvas" ref={canvasRef} className="block" />
          </div>

          {/* Agent Information Panel */}
          <div className="w-full border border-gray-200 rounded-md bg-white overflow-hidden flex flex-col max-h-[300px]">
            <div className="bg-gray-50 border-b border-gray-200 py-3 px-4 flex justify-between items-center font-medium text-sm text-gray-700">
              <span>Active Agents ({agentList.length})</span>
            </div>

            <div className="overflow-y-auto w-full p-2 space-y-2">
              {agentList.length === 0 ? (
                <div className="text-sm text-gray-400 p-4 text-center border-t border-gray-100">
                  No agents in the simulation. Add some!
                </div>
              ) : (
                agentList.map((agent) => (
                  <div
                    key={agent.id}
                    className="flex flex-wrap md:flex-nowrap justify-between items-center p-3 py-2 bg-gray-50 border border-gray-100 rounded hover:bg-gray-100 transition-colors gap-2"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-2 h-2 rounded-full ${agent.id.includes("Leader") ? "bg-red-500" : "bg-blue-500"}`}
                      />
                      <span className="text-sm font-semibold text-gray-800 w-28 truncate">
                        {agent.id}
                      </span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full border ${
                          agent.state === "Running"
                            ? "bg-green-50 text-green-700 border-green-200"
                            : agent.state === "Paused"
                              ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                              : "bg-gray-200 text-gray-700 border-gray-300"
                        }`}
                      >
                        {agent.state}
                      </span>
                    </div>

                    <div className="flex gap-1.5 ml-auto">
                      {agent.state === "Running" && (
                        <>
                          <button
                            onClick={() => handlePauseAgent(agent.id)}
                            className="cursor-pointer px-2 py-1 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 text-xs rounded border border-yellow-200 transition-colors"
                          >
                            Pause
                          </button>
                          <button
                            onClick={() => handleStopAgent(agent.id)}
                            className="cursor-pointer px-2 py-1 bg-red-100 hover:bg-red-200 text-red-800 text-xs rounded border border-red-200 transition-colors"
                          >
                            Stop
                          </button>
                        </>
                      )}

                      {agent.state === "Paused" && (
                        <>
                          <button
                            onClick={() => handleStartAgent(agent.id)}
                            className="cursor-pointer px-2 py-1 bg-green-100 hover:bg-green-200 text-green-800 text-xs rounded border border-green-200 transition-colors"
                          >
                            Start
                          </button>
                          <button
                            onClick={() => handleStopAgent(agent.id)}
                            className="cursor-pointer px-2 py-1 bg-red-100 hover:bg-red-200 text-red-800 text-xs rounded border border-red-200 transition-colors"
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
                          className="cursor-pointer px-2 py-1 bg-blue-100 hover:bg-blue-200 text-blue-800 text-xs rounded border border-blue-200 transition-colors"
                        >
                          Process & Start
                        </button>
                      )}

                      <button
                        onClick={() => handleRemoveAgent(agent.id)}
                        className="cursor-pointer px-2 py-1 bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs rounded border border-gray-300 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Global Controls */}
        <div className="flex flex-col gap-6 w-full lg:w-72 p-6 border border-gray-200 rounded-md bg-white h-auto flex-shrink-0">
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-medium text-gray-700 tracking-wider">
              Simulation Controls
            </h3>
            <button
              onClick={handleAddLeader}
              className="cursor-pointer w-full py-2 px-4 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50 text-sm"
            >
              Add Leader
            </button>
            <button
              onClick={handleAddFollower}
              className="cursor-pointer w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 text-sm"
            >
              Add Follower
            </button>
            <div className="text-xs text-gray-500 p-3 border border-gray-200 rounded-sm bg-gray-50 text-center mt-2">
              Followers will automatically follow nearby leaders.
            </div>
          </div>

          <button
            onClick={handleReset}
            className="cursor-pointer w-full py-2 px-4 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 text-sm mt-auto"
          >
            Clear All Agents
          </button>
        </div>
      </div>
    </div>
  );
}
