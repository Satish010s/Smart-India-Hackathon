import { generateDummyResearcherData } from '../utils/dummyData.js';

/**
 * GET /api/researcher/workspace
 * Returns researcher workspace overview.
 */
export const getResearcherWorkspace = (req, res) => {
  const { id, name, email, role } = req.user;
  const data = generateDummyResearcherData(name);

  return res.status(200).json({
    success: true,
    message: 'Researcher workspace data fetched successfully.',
    data: {
      user: { id, name, email, role },
      ...data.overview,
    },
  });
};

/**
 * GET /api/researcher/simulations
 * Returns running and past simulations.
 */
export const getSimulations = (req, res) => {
  const data = generateDummyResearcherData(req.user.name);
  return res.status(200).json({
    success: true,
    data: { simulations: data.simulations },
  });
};

/**
 * POST /api/researcher/simulations
 * Launch a new quantum simulation.
 */
export const launchSimulation = (req, res) => {
  const { name, qubits, backend, algorithm } = req.body;
  if (!name || !qubits) {
    return res.status(400).json({ success: false, error: 'Simulation name and qubit count are required.' });
  }
  const sim = {
    id: `sim-${Date.now()}`,
    name,
    qubits: parseInt(qubits),
    backend: backend || 'statevector_simulator',
    algorithm: algorithm || 'custom',
    status: 'QUEUED',
    progress: 0,
    createdAt: new Date().toISOString(),
  };
  return res.status(201).json({
    success: true,
    message: `Simulation "${name}" queued successfully.`,
    data: { simulation: sim },
  });
};

/**
 * GET /api/researcher/hardware
 * Returns QPU hardware quota and allocation.
 */
export const getHardwareQuota = (req, res) => {
  const data = generateDummyResearcherData(req.user.name);
  return res.status(200).json({
    success: true,
    data: data.hardware,
  });
};

/**
 * GET /api/researcher/papers
 * Returns research papers and publications.
 */
export const getResearchPapers = (req, res) => {
  const data = generateDummyResearcherData(req.user.name);
  return res.status(200).json({
    success: true,
    data: { papers: data.papers, total: data.papers.length },
  });
};

/**
 * POST /api/researcher/papers
 * Submit a new research paper / preprint.
 */
export const submitPaper = (req, res) => {
  const { title, abstract, authors } = req.body;
  if (!title || !abstract) {
    return res.status(400).json({ success: false, error: 'Title and abstract are required.' });
  }
  return res.status(201).json({
    success: true,
    message: 'Paper submitted for review.',
    data: {
      paper: {
        id: `paper-${Date.now()}`,
        title,
        abstract,
        authors: authors || [req.user.name],
        status: 'UNDER_REVIEW',
        submittedAt: new Date().toISOString(),
      },
    },
  });
};
