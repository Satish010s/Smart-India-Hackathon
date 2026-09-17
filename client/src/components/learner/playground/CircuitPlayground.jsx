"use client";

import React, { useState, useEffect } from 'react';
import { LuTrash2, LuTriangleAlert, LuInfo, LuCircleAlert } from 'react-icons/lu';
import { analyzeCircuit, generateCode } from './CodeGenerator';

const AVAILABLE_GATES = [
  { type: 'H', label: 'Hadamard', color: 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700' },
  { type: 'X', label: 'Pauli-X (NOT)', color: 'bg-green-100 text-green-800 border-green-300 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700' },
  { type: 'Y', label: 'Pauli-Y', color: 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-700' },
  { type: 'Z', label: 'Pauli-Z', color: 'bg-teal-100 text-teal-800 border-teal-300 dark:bg-teal-900/30 dark:text-teal-300 dark:border-teal-700' },
  { type: 'CX', label: 'CNOT', color: 'bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-700' },
  { type: 'M', label: 'Measure', color: 'bg-gray-200 text-gray-800 border-gray-400 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600' },
];

export default function CircuitPlayground({ framework, onCodeChange }) {
  const NUM_QUBITS = 4;
  const NUM_STEPS = 8;
  
  // Initialize 2D grid: circuit[qubit][step]
  const [circuit, setCircuit] = useState(() => 
    Array(NUM_QUBITS).fill(null).map(() => Array(NUM_STEPS).fill(null))
  );
  
  const [issues, setIssues] = useState([]);
  
  // Select & Place mechanic (replaces drag and drop for extreme reliability)
  const [selectedGate, setSelectedGate] = useState(null); // 'H', 'X', etc.
  
  // Refs to handle connection drawing for CNOT
  const [draggingControl, setDraggingControl] = useState(null); // { qubit, step }

  useEffect(() => {
    // Run static analysis
    const currentIssues = analyzeCircuit(circuit, NUM_QUBITS);
    setIssues(currentIssues);
    
    // Generate code
    const generated = generateCode(circuit, NUM_QUBITS, framework);
    if (onCodeChange) onCodeChange(generated);
    
  }, [circuit, framework]);

  // Handle clicking a cell on the grid
  const handleCellClick = (q, s) => {
    // If we are currently setting a CNOT control, resolve that first
    if (draggingControl && draggingControl.step === s) {
      finishCnotConnection(q);
      return;
    }

    // Place selected gate
    if (selectedGate) {
      setCircuit(prev => {
        const newCircuit = prev.map(row => [...row]);
        newCircuit[q][s] = { type: selectedGate, target: q };
        return newCircuit;
      });
      // Optionally deselect after placement: setSelectedGate(null); 
      // Keeping it selected allows rapid placement of multiple gates.
    }
  };

  const removeGate = (q, s) => {
    setCircuit(prev => {
      const newCircuit = prev.map(row => [...row]);
      newCircuit[q][s] = null;
      return newCircuit;
    });
  };

  const getGateColor = (type) => {
    return AVAILABLE_GATES.find(g => g.type === type)?.color || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  // Begin establishing a CNOT connection
  const startCnotConnection = (q, s) => {
    setDraggingControl({ qubit: q, step: s });
  };

  // Finish CNOT connection
  const finishCnotConnection = (controlQ) => {
    if (draggingControl && draggingControl.qubit !== controlQ) {
      setCircuit(prev => {
        const newCircuit = prev.map(row => [...row]);
        const targetGate = newCircuit[draggingControl.qubit][draggingControl.step];
        if (targetGate && targetGate.type === 'CX') {
          targetGate.control = controlQ;
        }
        return newCircuit;
      });
    }
    setDraggingControl(null);
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 h-full font-sans">
      {/* Palette Sidebar */}
      <div className="w-full md:w-64 flex-shrink-0 bg-white dark:bg-[var(--color-surface)] border border-[var(--color-border)] rounded-md shadow-sm p-4">
        <h3 className="text-sm font-bold uppercase tracking-wide text-[var(--color-text)] mb-4 pb-2 border-b border-[var(--color-border)]">Gate Palette</h3>
        <p className="text-xs text-[var(--color-muted)] mb-4">Click a gate to select it, then click the grid to place.</p>
        
        <div className="grid grid-cols-2 gap-3">
          {AVAILABLE_GATES.map(gate => (
            <button
              key={gate.type}
              onClick={() => setSelectedGate(selectedGate === gate.type ? null : gate.type)}
              className={`flex items-center justify-center p-3 rounded border shadow-sm transition-all hover:scale-105 active:scale-95 ${gate.color} ${selectedGate === gate.type ? 'ring-2 ring-blue-500 shadow-md scale-105' : 'opacity-90'}`}
            >
              <span className="font-bold font-mono text-sm">{gate.type}</span>
            </button>
          ))}
        </div>
        
        {selectedGate && (
           <button onClick={() => setSelectedGate(null)} className="w-full mt-4 py-2 text-xs font-bold text-red-600 bg-red-50 rounded-md border border-red-200">
             Clear Selection
           </button>
        )}

        {/* Instructions */}
        <div className="mt-8 p-3 bg-blue-50 dark:bg-blue-900/10 rounded-md border border-blue-200 dark:border-blue-800/30">
          <h4 className="text-xs font-bold text-blue-800 dark:text-blue-300 mb-1 flex items-center gap-1"><LuInfo size={14}/> Tips</h4>
          <ul className="text-xs text-blue-700 dark:text-blue-400 space-y-1 pl-4 list-disc">
            <li>Select a gate, then click any dashed box on the wires to place it.</li>
            <li>Double-click a placed gate to delete it.</li>
            <li>For CNOT (CX), place it on the <b>target</b> qubit, click its red dot, and then click any empty box on the same time step to set the <b>control</b>.</li>
          </ul>
        </div>
      </div>

      {/* Main Circuit Area */}
      <div className="flex-1 flex flex-col gap-6">
        
        {/* Analysis Bar */}
        {issues.length > 0 && (
          <div className="bg-white dark:bg-[var(--color-surface)] border border-[var(--color-border)] rounded-md shadow-sm overflow-hidden">
            <div className="bg-amber-50 dark:bg-amber-900/20 px-4 py-2 border-b border-amber-200 dark:border-amber-800/30 flex items-center gap-2 text-amber-800 dark:text-amber-400 text-sm font-bold">
              <LuTriangleAlert /> Static Analysis ({issues.length})
            </div>
            <div className="p-2 max-h-32 overflow-y-auto">
              {issues.map((issue, idx) => (
                <div key={idx} className="flex gap-2 p-2 text-sm border-b border-[var(--color-border)] last:border-0">
                  <div className="mt-0.5 flex-shrink-0">
                    {issue.type === 'error' ? <LuCircleAlert className="text-red-500"/> :
                     issue.type === 'warning' ? <LuTriangleAlert className="text-amber-500"/> :
                     <LuInfo className="text-blue-500"/>}
                  </div>
                  <div>
                    <div className={`font-medium ${issue.type === 'error' ? 'text-red-700 dark:text-red-400' : issue.type === 'warning' ? 'text-amber-700 dark:text-amber-400' : 'text-blue-700 dark:text-blue-400'}`}>
                      {issue.message}
                    </div>
                    {issue.suggestion && <div className="text-xs text-[var(--color-muted)] mt-1">{issue.suggestion}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Circuit Grid */}
        <div 
           className={`flex-1 bg-[#faf9f5] dark:bg-[var(--color-background)] border rounded-md shadow-sm p-6 overflow-x-auto relative min-h-[300px] transition-colors ${selectedGate ? 'border-blue-400 cursor-crosshair' : 'border-[var(--color-border)]'}`}
        >
          
          <div className="relative inline-block min-w-max">
            {circuit.map((row, qIndex) => (
              <div key={`q-${qIndex}`} className="flex items-center h-16 relative">
                {/* Qubit Label */}
                <div className="w-12 text-right pr-4 font-mono font-bold text-sm text-[var(--color-text)]">
                  q_{qIndex}
                </div>
                
                {/* The Wire */}
                <div className="absolute left-12 right-0 h-[2px] bg-gray-300 dark:bg-gray-600 top-1/2 -translate-y-1/2 z-0" />

                {/* Steps */}
                <div className="flex gap-2 pl-2 relative z-10">
                  {row.map((gate, sIndex) => (
                    <div 
                      key={`cell-${qIndex}-${sIndex}`}
                      onClick={() => handleCellClick(qIndex, sIndex)}
                      className={`w-12 h-12 flex items-center justify-center border-2 border-dashed rounded transition-colors relative ${
                         gate ? 'border-transparent cursor-default' : selectedGate || draggingControl ? 'border-blue-300 dark:border-blue-700 hover:border-blue-500 bg-white/50 dark:bg-blue-900/20 cursor-pointer' : 'border-gray-200 dark:border-gray-700 hover:border-gray-400 bg-white/50 dark:bg-black/20'
                      }`}
                    >
                      {/* Empty cell but valid connection point for CNOT */}
                      {!gate && draggingControl?.step === sIndex && (
                         <div 
                           className="w-4 h-4 rounded-full bg-purple-500 animate-pulse" 
                           title="Set as Control Qubit"
                         />
                      )}

                      {gate && (
                        <div
                          onDoubleClick={(e) => { e.stopPropagation(); removeGate(qIndex, sIndex); }}
                          className={`w-10 h-10 flex items-center justify-center rounded border shadow-sm absolute z-10 ${getGateColor(gate.type)}`}
                        >
                          <span className="font-bold font-mono text-sm">{gate.type}</span>
                          
                          {/* CNOT Control Setup UI */}
                          {gate.type === 'CX' && (gate.control === undefined || gate.control === null) && (
                            <div 
                              onClick={(e) => { e.stopPropagation(); startCnotConnection(qIndex, sIndex); }}
                              className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full cursor-pointer border-2 border-white dark:border-black hover:scale-125 transition-transform shadow-md"
                              title="Click to assign control qubit"
                            />
                          )}
                        </div>
                      )}

                      {/* Render vertical line for CNOT if this is the target and control is set */}
                      {gate && gate.type === 'CX' && gate.control !== undefined && gate.control !== null && (
                         <div className="absolute left-1/2 w-0.5 bg-purple-500 -z-10" 
                              style={{
                                top: gate.control < qIndex ? `-${(qIndex - gate.control) * 4}rem` : '50%',
                                bottom: gate.control > qIndex ? `-${(gate.control - qIndex) * 4}rem` : '50%',
                                height: `calc(${Math.abs(gate.control - qIndex) * 4}rem)`
                              }}
                         />
                      )}
                      
                      {/* Render control dot for CNOT if this cell IS the target (drawn from target perspective) */}
                      {gate && gate.type === 'CX' && gate.control !== undefined && gate.control !== null && (
                         <div className="absolute left-1/2 w-3 h-3 bg-purple-500 rounded-full -translate-x-1/2" 
                              style={{
                                top: gate.control < qIndex ? `calc(-${(qIndex - gate.control) * 4}rem + 50% - 0.375rem)` : `calc(${(gate.control - qIndex) * 4}rem + 50% - 0.375rem)`,
                              }}
                         />
                      )}

                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
