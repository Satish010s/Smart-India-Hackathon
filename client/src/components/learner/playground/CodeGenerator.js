/**
 * analyzeCircuit — static analysis and validation
 */
export function analyzeCircuit(circuit, numQubits) {
  const issues = [];
  if (!circuit || !Array.isArray(circuit) || circuit.length === 0) return issues;

  const actualQubits = Math.min(numQubits || 0, circuit.length);
  const measurementIndices = new Array(actualQubits).fill(-1);
  const numSteps = circuit[0]?.length || 0;

  for (let s = 0; s < numSteps; s++) {
    const stepGates = [];
    for (let q = 0; q < actualQubits; q++) {
      const g = circuit[q]?.[s];
      if (g) stepGates.push({ qubit: q, gate: g });
    }

    for (const { qubit, gate } of stepGates) {
      if (measurementIndices[qubit] !== -1 && gate.type !== 'M') {
        issues.push({ type: 'warning', message: `Gate ${gate.type} on qubit ${qubit} placed after a measurement.`, suggestion: 'Measurements collapse the state. Place operations before measurement.' });
      }
      if (gate.type === 'M') measurementIndices[qubit] = s;

      if (['CX','CY','CZ','CH','CP','CSWAP'].includes(gate.type)) {
        if (gate.control === undefined || gate.control === null) {
          issues.push({ type: 'error', message: `${gate.type} gate on qubit ${qubit} is missing a control qubit.`, suggestion: 'Click the red dot on the gate to assign a control qubit.' });
        } else if (gate.control === qubit) {
          issues.push({ type: 'error', message: `${gate.type} gate on qubit ${qubit} cannot control itself.` });
        }
      }

      if (gate.type === 'CCX') {
        if (gate.control === undefined || gate.control === null) {
          issues.push({ type: 'error', message: `Toffoli (CCX) gate on qubit ${qubit} is missing control1.`, suggestion: 'Click the red dot to assign first control qubit.' });
        } else if (gate.control2 === undefined || gate.control2 === null) {
          issues.push({ type: 'warning', message: `Toffoli (CCX) gate on qubit ${qubit} has only one control assigned.`, suggestion: 'Click the gate again to assign the second control qubit.' });
        }
      }

      if (gate.type === 'SWAP' && (gate.target2 === undefined || gate.target2 === null)) {
        issues.push({ type: 'error', message: `SWAP gate on qubit ${qubit} needs a second target qubit.`, suggestion: 'Click the orange dot on the gate to assign the swap partner.' });
      }
    }
  }

  for (let q = 0; q < actualQubits; q++) {
    let lastGate = null, lastStep = -1;
    for (let s = 0; s < numSteps; s++) {
      const gate = circuit[q]?.[s];
      if (gate && !['CX','CY','CZ','CH','CCX','CSWAP','CP','M','RESET','SWAP'].includes(gate.type)) {
        if (lastGate && lastGate.type === gate.type && s === lastStep + 1) {
          issues.push({ type: 'info', message: `Two consecutive ${gate.type} gates on qubit ${q} detected.`, suggestion: 'These may cancel each other out. Check if intentional.' });
        }
        lastGate = gate; lastStep = s;
      } else if (gate) {
        lastGate = gate; lastStep = s;
      }
    }
  }

  return issues;
}

/**
 * generateCode — translates circuit grid to a quantum framework script
 */
export function generateCode(circuit, numQubits, framework, shots = 1024) {
  if (!circuit || !Array.isArray(circuit) || circuit.length === 0) return '';
  const hasGates = circuit.some(row => row?.some(g => g !== null && g !== undefined));
  if (!hasGates) return '';

  const actualQubits = Math.min(numQubits || 0, circuit.length);
  const numSteps = circuit[0]?.length || 0;

  function fmtAngle(rad) {
    if (rad === undefined || rad === null) return '0';
    return String(rad);
  }

  function fmtAnglePy(rad) {
    if (rad === undefined || rad === null) return '0';
    const pi = Math.PI;
    const fracs = [
      [2*pi, '2*math.pi'], [pi, 'math.pi'], [pi/2, 'math.pi/2'],
      [pi/4, 'math.pi/4'], [pi*3/4, '3*math.pi/4'], [pi*3/2, '3*math.pi/2'],
      [pi/3, 'math.pi/3'], [2*pi/3, '2*math.pi/3'], [pi/6, 'math.pi/6'], [0, '0'],
    ];
    for (const [val, str] of fracs) {
      if (Math.abs(rad - val) < 1e-9) return str;
    }
    return String(rad);
  }

  // ─── QISKIT ───────────────────────────────────────────────────────────────
  if (framework === 'qiskit') {
    let code = `from qiskit import QuantumCircuit\nfrom qiskit_aer import AerSimulator\nimport math\n\n# Initialize circuit\nqc = QuantumCircuit(${actualQubits}, ${actualQubits})\n\n# Circuit construction\n`;
    let measured = false;
    for (let s = 0; s < numSteps; s++) {
      for (let q = 0; q < actualQubits; q++) {
        const g = circuit[q]?.[s];
        if (!g) continue;
        switch (g.type) {
          case 'H':    code += `qc.h(${q})\n`; break;
          case 'X':    code += `qc.x(${q})\n`; break;
          case 'Y':    code += `qc.y(${q})\n`; break;
          case 'Z':    code += `qc.z(${q})\n`; break;
          case 'S':    code += `qc.s(${q})\n`; break;
          case 'SDG':  code += `qc.sdg(${q})\n`; break;
          case 'T':    code += `qc.t(${q})\n`; break;
          case 'TDG':  code += `qc.tdg(${q})\n`; break;
          case 'SX':   code += `qc.sx(${q})\n`; break;
          case 'RX':   code += `qc.rx(${fmtAnglePy(g.angle)}, ${q})\n`; break;
          case 'RY':   code += `qc.ry(${fmtAnglePy(g.angle)}, ${q})\n`; break;
          case 'RZ':   code += `qc.rz(${fmtAnglePy(g.angle)}, ${q})\n`; break;
          case 'P':    code += `qc.p(${fmtAnglePy(g.angle)}, ${q})\n`; break;
          case 'CX':   if (g.control != null) code += `qc.cx(${g.control}, ${q})\n`; break;
          case 'CY':   if (g.control != null) code += `qc.cy(${g.control}, ${q})\n`; break;
          case 'CZ':   if (g.control != null) code += `qc.cz(${g.control}, ${q})\n`; break;
          case 'CH':   if (g.control != null) code += `qc.ch(${g.control}, ${q})\n`; break;
          case 'CP':   if (g.control != null) code += `qc.cp(${fmtAnglePy(g.angle)}, ${g.control}, ${q})\n`; break;
          case 'SWAP': if (g.target2 != null) code += `qc.swap(${q}, ${g.target2})\n`; break;
          case 'CCX':  if (g.control != null && g.control2 != null) code += `qc.ccx(${g.control}, ${g.control2}, ${q})\n`; break;
          case 'CSWAP':if (g.control != null && g.target2 != null) code += `qc.cswap(${g.control}, ${q}, ${g.target2})\n`; break;
          case 'RESET':code += `qc.reset(${q})\n`; break;
          case 'M':    code += `qc.measure(${q}, ${q})\n`; measured = true; break;
        }
      }
    }
    if (measured) {
      code += `\n# Run simulation\nsimulator = AerSimulator()\njob = simulator.run(qc, shots=${shots})\nresult = job.result()\ncounts = result.get_counts()\nprint(counts)\n`;
    }
    return code;
  }

  // ─── CIRQ ─────────────────────────────────────────────────────────────────
  if (framework === 'cirq') {
    let code = `import cirq\nimport math\n\n# Initialize qubits\nqubits = [cirq.LineQubit(i) for i in range(${actualQubits})]\ncircuit = cirq.Circuit()\n\n# Circuit construction\n`;
    let measuredQubits = [];
    for (let s = 0; s < numSteps; s++) {
      for (let q = 0; q < actualQubits; q++) {
        const g = circuit[q]?.[s];
        if (!g) continue;
        switch (g.type) {
          case 'H':    code += `circuit.append(cirq.H(qubits[${q}]))\n`; break;
          case 'X':    code += `circuit.append(cirq.X(qubits[${q}]))\n`; break;
          case 'Y':    code += `circuit.append(cirq.Y(qubits[${q}]))\n`; break;
          case 'Z':    code += `circuit.append(cirq.Z(qubits[${q}]))\n`; break;
          case 'S':    code += `circuit.append(cirq.S(qubits[${q}]))\n`; break;
          case 'SDG':  code += `circuit.append(cirq.S(qubits[${q}])**-1)\n`; break;
          case 'T':    code += `circuit.append(cirq.T(qubits[${q}]))\n`; break;
          case 'TDG':  code += `circuit.append(cirq.T(qubits[${q}])**-1)\n`; break;
          case 'SX':   code += `circuit.append(cirq.X(qubits[${q}])**0.5)\n`; break;
          case 'RX':   code += `circuit.append(cirq.rx(${fmtAnglePy(g.angle)})(qubits[${q}]))\n`; break;
          case 'RY':   code += `circuit.append(cirq.ry(${fmtAnglePy(g.angle)})(qubits[${q}]))\n`; break;
          case 'RZ':   code += `circuit.append(cirq.rz(${fmtAnglePy(g.angle)})(qubits[${q}]))\n`; break;
          case 'P':    code += `circuit.append(cirq.ZPowGate(exponent=${fmtAnglePy(g.angle)}/math.pi)(qubits[${q}]))\n`; break;
          case 'CX':   if (g.control != null) code += `circuit.append(cirq.CNOT(qubits[${g.control}], qubits[${q}]))\n`; break;
          case 'CY':   if (g.control != null) code += `circuit.append(cirq.ControlledGate(cirq.Y)(qubits[${g.control}], qubits[${q}]))\n`; break;
          case 'CZ':   if (g.control != null) code += `circuit.append(cirq.CZ(qubits[${g.control}], qubits[${q}]))\n`; break;
          case 'CH':   if (g.control != null) code += `circuit.append(cirq.ControlledGate(cirq.H)(qubits[${g.control}], qubits[${q}]))\n`; break;
          case 'CP':   if (g.control != null) code += `circuit.append(cirq.CZPowGate(exponent=${fmtAnglePy(g.angle)}/math.pi)(qubits[${g.control}], qubits[${q}]))\n`; break;
          case 'SWAP': if (g.target2 != null) code += `circuit.append(cirq.SWAP(qubits[${q}], qubits[${g.target2}]))\n`; break;
          case 'CCX':  if (g.control != null && g.control2 != null) code += `circuit.append(cirq.CCX(qubits[${g.control}], qubits[${g.control2}], qubits[${q}]))\n`; break;
          case 'CSWAP':if (g.control != null && g.target2 != null) code += `circuit.append(cirq.CSWAP(qubits[${g.control}], qubits[${q}], qubits[${g.target2}]))\n`; break;
          case 'RESET':code += `circuit.append(cirq.reset(qubits[${q}]))\n`; break;
          case 'M':    if (!measuredQubits.includes(q)) measuredQubits.push(q); break;
        }
      }
    }
    if (measuredQubits.length > 0) {
      code += `circuit.append(cirq.measure(*[qubits[i] for i in [${measuredQubits.join(', ')}]], key='result'))\n\nsimulator = cirq.Simulator()\nresult = simulator.run(circuit, repetitions=${shots})\nprint("Counts:", result.histogram(key='result'))\n`;
    } else {
      code += `\nprint(circuit)`;
    }
    return code;
  }

  // ─── PENNYLANE ────────────────────────────────────────────────────────────
  if (framework === 'pennylane') {
    let code = `import pennylane as qml\nimport math\n\ndev = qml.device('default.qubit', wires=${actualQubits}, shots=${shots})\n\n@qml.qnode(dev)\ndef circuit():\n`;
    let measuredQubits = [];
    let hasOps = false;
    for (let s = 0; s < numSteps; s++) {
      for (let q = 0; q < actualQubits; q++) {
        const g = circuit[q]?.[s];
        if (!g) continue;
        hasOps = true;
        switch (g.type) {
          case 'H':    code += `    qml.Hadamard(wires=${q})\n`; break;
          case 'X':    code += `    qml.PauliX(wires=${q})\n`; break;
          case 'Y':    code += `    qml.PauliY(wires=${q})\n`; break;
          case 'Z':    code += `    qml.PauliZ(wires=${q})\n`; break;
          case 'S':    code += `    qml.S(wires=${q})\n`; break;
          case 'SDG':  code += `    qml.adjoint(qml.S)(wires=${q})\n`; break;
          case 'T':    code += `    qml.T(wires=${q})\n`; break;
          case 'TDG':  code += `    qml.adjoint(qml.T)(wires=${q})\n`; break;
          case 'SX':   code += `    qml.SX(wires=${q})\n`; break;
          case 'RX':   code += `    qml.RX(${fmtAnglePy(g.angle)}, wires=${q})\n`; break;
          case 'RY':   code += `    qml.RY(${fmtAnglePy(g.angle)}, wires=${q})\n`; break;
          case 'RZ':   code += `    qml.RZ(${fmtAnglePy(g.angle)}, wires=${q})\n`; break;
          case 'P':    code += `    qml.PhaseShift(${fmtAnglePy(g.angle)}, wires=${q})\n`; break;
          case 'CX':   if (g.control != null) code += `    qml.CNOT(wires=[${g.control}, ${q}])\n`; break;
          case 'CY':   if (g.control != null) code += `    qml.CY(wires=[${g.control}, ${q}])\n`; break;
          case 'CZ':   if (g.control != null) code += `    qml.CZ(wires=[${g.control}, ${q}])\n`; break;
          case 'CH':   if (g.control != null) code += `    qml.CH(wires=[${g.control}, ${q}])\n`; break;
          case 'CP':   if (g.control != null) code += `    qml.ControlledPhaseShift(${fmtAnglePy(g.angle)}, wires=[${g.control}, ${q}])\n`; break;
          case 'SWAP': if (g.target2 != null) code += `    qml.SWAP(wires=[${q}, ${g.target2}])\n`; break;
          case 'CCX':  if (g.control != null && g.control2 != null) code += `    qml.Toffoli(wires=[${g.control}, ${g.control2}, ${q}])\n`; break;
          case 'CSWAP':if (g.control != null && g.target2 != null) code += `    qml.CSWAP(wires=[${g.control}, ${q}, ${g.target2}])\n`; break;
          case 'RESET':code += `    qml.BasisState([0], wires=${q})\n`; break;
          case 'M':    if (!measuredQubits.includes(q)) measuredQubits.push(q); break;
        }
      }
    }
    if (!hasOps) code += `    pass\n`;
    if (measuredQubits.length > 0) code += `    return qml.counts(wires=[${measuredQubits.join(', ')}])\n`;
    else code += `    return qml.state()\n`;
    code += `\ncounts = circuit()\nprint("Counts:", counts)\n`;
    return code;
  }

  // ─── AMAZON BRAKET ────────────────────────────────────────────────────────
  if (framework === 'braket') {
    let code = `from braket.circuits import Circuit\nfrom braket.devices import LocalSimulator\nimport math\n\ncircuit = Circuit()\n\n# Circuit construction\n`;
    for (let s = 0; s < numSteps; s++) {
      for (let q = 0; q < actualQubits; q++) {
        const g = circuit[q]?.[s];
        if (!g) continue;
        switch (g.type) {
          case 'H':    code += `circuit.h(${q})\n`; break;
          case 'X':    code += `circuit.x(${q})\n`; break;
          case 'Y':    code += `circuit.y(${q})\n`; break;
          case 'Z':    code += `circuit.z(${q})\n`; break;
          case 'S':    code += `circuit.s(${q})\n`; break;
          case 'SDG':  code += `circuit.si(${q})\n`; break;
          case 'T':    code += `circuit.t(${q})\n`; break;
          case 'TDG':  code += `circuit.ti(${q})\n`; break;
          case 'SX':   code += `circuit.v(${q})\n`; break;
          case 'RX':   code += `circuit.rx(${q}, ${fmtAnglePy(g.angle)})\n`; break;
          case 'RY':   code += `circuit.ry(${q}, ${fmtAnglePy(g.angle)})\n`; break;
          case 'RZ':   code += `circuit.rz(${q}, ${fmtAnglePy(g.angle)})\n`; break;
          case 'P':    code += `circuit.phaseshift(${q}, ${fmtAnglePy(g.angle)})\n`; break;
          case 'CX':   if (g.control != null) code += `circuit.cnot(${g.control}, ${q})\n`; break;
          case 'CY':   if (g.control != null) code += `circuit.cy(${g.control}, ${q})\n`; break;
          case 'CZ':   if (g.control != null) code += `circuit.cz(${g.control}, ${q})\n`; break;
          case 'CP':   if (g.control != null) code += `circuit.cphaseshift(${g.control}, ${q}, ${fmtAnglePy(g.angle)})\n`; break;
          case 'SWAP': if (g.target2 != null) code += `circuit.swap(${q}, ${g.target2})\n`; break;
          case 'CCX':  if (g.control != null && g.control2 != null) code += `circuit.ccnot(${g.control}, ${g.control2}, ${q})\n`; break;
          case 'CSWAP':if (g.control != null && g.target2 != null) code += `circuit.cswap(${g.control}, ${q}, ${g.target2})\n`; break;
        }
      }
    }
    code += `\ndevice = LocalSimulator()\ntask = device.run(circuit, shots=${shots})\nresult = task.result()\nprint("Measurement counts:", result.measurement_counts)\n`;
    return code;
  }

  // ─── OPENQASM ─────────────────────────────────────────────────────────────
  if (framework === 'openqasm') {
    let code = `OPENQASM 2.0;\ninclude "qelib1.inc";\n\nqreg q[${actualQubits}];\ncreg c[${actualQubits}];\n\n`;
    for (let s = 0; s < numSteps; s++) {
      for (let q = 0; q < actualQubits; q++) {
        const g = circuit[q]?.[s];
        if (!g) continue;
        const a = fmtAngle(g.angle);
        switch (g.type) {
          case 'H':    code += `h q[${q}];\n`; break;
          case 'X':    code += `x q[${q}];\n`; break;
          case 'Y':    code += `y q[${q}];\n`; break;
          case 'Z':    code += `z q[${q}];\n`; break;
          case 'S':    code += `s q[${q}];\n`; break;
          case 'SDG':  code += `sdg q[${q}];\n`; break;
          case 'T':    code += `t q[${q}];\n`; break;
          case 'TDG':  code += `tdg q[${q}];\n`; break;
          case 'SX':   code += `sx q[${q}];\n`; break;
          case 'RX':   code += `rx(${a}) q[${q}];\n`; break;
          case 'RY':   code += `ry(${a}) q[${q}];\n`; break;
          case 'RZ':   code += `rz(${a}) q[${q}];\n`; break;
          case 'P':    code += `p(${a}) q[${q}];\n`; break;
          case 'CX':   if (g.control != null) code += `cx q[${g.control}],q[${q}];\n`; break;
          case 'CY':   if (g.control != null) code += `cy q[${g.control}],q[${q}];\n`; break;
          case 'CZ':   if (g.control != null) code += `cz q[${g.control}],q[${q}];\n`; break;
          case 'CH':   if (g.control != null) code += `ch q[${g.control}],q[${q}];\n`; break;
          case 'CP':   if (g.control != null) code += `cp(${a}) q[${g.control}],q[${q}];\n`; break;
          case 'SWAP': if (g.target2 != null) code += `swap q[${q}],q[${g.target2}];\n`; break;
          case 'CCX':  if (g.control != null && g.control2 != null) code += `ccx q[${g.control}],q[${g.control2}],q[${q}];\n`; break;
          case 'CSWAP':if (g.control != null && g.target2 != null) code += `cswap q[${g.control}],q[${q}],q[${g.target2}];\n`; break;
          case 'RESET':code += `reset q[${q}];\n`; break;
          case 'M':    code += `measure q[${q}] -> c[${q}];\n`; break;
        }
      }
    }
    return code;
  }

  return '# Unsupported framework';
}

/**
 * parseQasmToCircuit — parses OpenQASM string into graphical circuit grid
 */
export function parseQasmToCircuit(qasmText) {
  if (!qasmText || typeof qasmText !== 'string') return null;

  const lines = qasmText.split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('//') && !l.startsWith('OPENQASM') && !l.startsWith('include'));

  let numQubits = 3;
  const gatesList = [];

  for (const l of lines) {
    const qregMatch = l.match(/qreg\s+([a-zA-Z0-9_]+)\[(\d+)\];/);
    if (qregMatch) {
      numQubits = Math.max(2, Math.min(8, parseInt(qregMatch[2], 10)));
    }
  }

  const parseQubitIndex = (str) => {
    const m = str.match(/\[(\d+)\]/);
    return m ? parseInt(m[1], 10) : 0;
  };

  const parseAngle = (str) => {
    const m = str.match(/\(([^)]+)\)/);
    if (!m) return Math.PI / 2;
    const raw = m[1].replace(/math\./g, '').trim();
    if (raw === 'pi' || raw === 'math.pi') return Math.PI;
    if (raw === 'pi/2' || raw === 'math.pi/2') return Math.PI / 2;
    if (raw === 'pi/4' || raw === 'math.pi/4') return Math.PI / 4;
    if (raw === '3*pi/4' || raw === '3*math.pi/4') return 3 * Math.PI / 4;
    if (raw === '2*pi' || raw === '2*math.pi') return 2 * Math.PI;
    const num = parseFloat(raw);
    return isNaN(num) ? Math.PI / 2 : num;
  };

  for (const l of lines) {
    if (l.startsWith('qreg') || l.startsWith('creg')) continue;
    const cleanLine = l.replace(/;$/, '').trim();

    if (cleanLine.startsWith('h ')) {
      gatesList.push({ type: 'H', target: parseQubitIndex(cleanLine) });
    } else if (cleanLine.startsWith('x ')) {
      gatesList.push({ type: 'X', target: parseQubitIndex(cleanLine) });
    } else if (cleanLine.startsWith('y ')) {
      gatesList.push({ type: 'Y', target: parseQubitIndex(cleanLine) });
    } else if (cleanLine.startsWith('z ')) {
      gatesList.push({ type: 'Z', target: parseQubitIndex(cleanLine) });
    } else if (cleanLine.startsWith('s ')) {
      gatesList.push({ type: 'S', target: parseQubitIndex(cleanLine) });
    } else if (cleanLine.startsWith('sdg ')) {
      gatesList.push({ type: 'SDG', target: parseQubitIndex(cleanLine) });
    } else if (cleanLine.startsWith('t ')) {
      gatesList.push({ type: 'T', target: parseQubitIndex(cleanLine) });
    } else if (cleanLine.startsWith('tdg ')) {
      gatesList.push({ type: 'TDG', target: parseQubitIndex(cleanLine) });
    } else if (cleanLine.startsWith('sx ')) {
      gatesList.push({ type: 'SX', target: parseQubitIndex(cleanLine) });
    } else if (cleanLine.startsWith('rx')) {
      gatesList.push({ type: 'RX', target: parseQubitIndex(cleanLine), angle: parseAngle(cleanLine) });
    } else if (cleanLine.startsWith('ry')) {
      gatesList.push({ type: 'RY', target: parseQubitIndex(cleanLine), angle: parseAngle(cleanLine) });
    } else if (cleanLine.startsWith('rz')) {
      gatesList.push({ type: 'RZ', target: parseQubitIndex(cleanLine), angle: parseAngle(cleanLine) });
    } else if (cleanLine.startsWith('p(')) {
      gatesList.push({ type: 'P', target: parseQubitIndex(cleanLine), angle: parseAngle(cleanLine) });
    } else if (cleanLine.startsWith('cx ')) {
      const parts = cleanLine.substring(3).split(',');
      if (parts.length >= 2) {
        gatesList.push({ type: 'CX', target: parseQubitIndex(parts[1]), control: parseQubitIndex(parts[0]) });
      }
    } else if (cleanLine.startsWith('cy ')) {
      const parts = cleanLine.substring(3).split(',');
      if (parts.length >= 2) {
        gatesList.push({ type: 'CY', target: parseQubitIndex(parts[1]), control: parseQubitIndex(parts[0]) });
      }
    } else if (cleanLine.startsWith('cz ')) {
      const parts = cleanLine.substring(3).split(',');
      if (parts.length >= 2) {
        gatesList.push({ type: 'CZ', target: parseQubitIndex(parts[1]), control: parseQubitIndex(parts[0]) });
      }
    } else if (cleanLine.startsWith('ch ')) {
      const parts = cleanLine.substring(3).split(',');
      if (parts.length >= 2) {
        gatesList.push({ type: 'CH', target: parseQubitIndex(parts[1]), control: parseQubitIndex(parts[0]) });
      }
    } else if (cleanLine.startsWith('cp')) {
      const angle = parseAngle(cleanLine);
      const rest = cleanLine.replace(/cp\([^)]*\)/, '').trim();
      const parts = rest.split(',');
      if (parts.length >= 2) {
        gatesList.push({ type: 'CP', target: parseQubitIndex(parts[1]), control: parseQubitIndex(parts[0]), angle });
      }
    } else if (cleanLine.startsWith('swap ')) {
      const parts = cleanLine.substring(5).split(',');
      if (parts.length >= 2) {
        gatesList.push({ type: 'SWAP', target: parseQubitIndex(parts[0]), target2: parseQubitIndex(parts[1]) });
      }
    } else if (cleanLine.startsWith('ccx ')) {
      const parts = cleanLine.substring(4).split(',');
      if (parts.length >= 3) {
        gatesList.push({ type: 'CCX', target: parseQubitIndex(parts[2]), control: parseQubitIndex(parts[0]), control2: parseQubitIndex(parts[1]) });
      }
    } else if (cleanLine.startsWith('cswap ')) {
      const parts = cleanLine.substring(6).split(',');
      if (parts.length >= 3) {
        gatesList.push({ type: 'CSWAP', target: parseQubitIndex(parts[1]), control: parseQubitIndex(parts[0]), target2: parseQubitIndex(parts[2]) });
      }
    } else if (cleanLine.startsWith('measure ')) {
      gatesList.push({ type: 'M', target: parseQubitIndex(cleanLine) });
    } else if (cleanLine.startsWith('reset ')) {
      gatesList.push({ type: 'RESET', target: parseQubitIndex(cleanLine) });
    }
  }

  const numSteps = Math.max(8, Math.min(16, gatesList.length || 8));
  const newCircuit = Array(numQubits).fill(null).map(() => Array(numSteps).fill(null));

  let currentStep = 0;
  for (const g of gatesList) {
    if (currentStep >= numSteps) break;
    const tgt = Math.min(numQubits - 1, Math.max(0, g.target));
    newCircuit[tgt][currentStep] = g;
    currentStep++;
  }

  return {
    numQubits,
    numSteps,
    circuit: newCircuit,
  };
}

