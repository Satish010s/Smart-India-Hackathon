import express from 'express';
import {
  getResearcherWorkspace,
  getSimulations,
  launchSimulation,
  getHardwareQuota,
  getResearchPapers,
  submitPaper,
} from '../controllers/researcherController.js';
import { authenticateUser, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// All researcher routes require authentication and RESEARCHER/ADMIN role
router.use(authenticateUser);
router.use(authorizeRoles('RESEARCHER', 'ADMIN'));

// Workspace overview
router.get('/workspace', getResearcherWorkspace);

// Simulations
router.get('/simulations', getSimulations);
router.post('/simulations', launchSimulation);

// Hardware quota
router.get('/hardware', getHardwareQuota);

// Research papers
router.get('/papers', getResearchPapers);
router.post('/papers', submitPaper);

export default router;
