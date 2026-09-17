const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'server/src/controllers/experimentController.js');
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  'const { name, objective, hypothesis = \'\', tags = [] } = req.body;',
  'const { name, objective, hypothesis = \'\', tags = [], circuitCode, backend, framework, parameters, observations, simulationRunId } = req.body;'
);

content = content.replace(
  `    const experiment = await prisma.experiment.create({
      data: {
        userId: req.user.id,
        name: name.trim(),
        objective: objective.trim(),
        hypothesis: hypothesis.trim(),
        tags: Array.isArray(tags) ? tags : [],
        status: 'DRAFT',
      },
    });`,
  `    const data = {
      userId: req.user.id,
      name: name.trim(),
      objective: objective.trim(),
      hypothesis: hypothesis.trim(),
      tags: Array.isArray(tags) ? tags : [],
      status: simulationRunId ? 'COMPLETED' : 'DRAFT',
    };
    if (circuitCode) data.circuitCode = circuitCode;
    if (backend) data.backend = backend;
    if (framework) data.framework = framework;
    if (parameters) data.parameters = parameters;
    if (observations) data.observations = observations;

    const experiment = await prisma.experiment.create({ data });

    // Link simulation run if provided
    if (simulationRunId) {
      const simRun = await prisma.simulationRun.findFirst({ where: { id: simulationRunId, userId: req.user.id } });
      if (simRun) {
        await prisma.simulationRun.update({ where: { id: simRun.id }, data: { experimentId: experiment.id } });
        await prisma.experiment.update({
          where: { id: experiment.id },
          data: {
            reproducibility: {
              lastRunAt: new Date().toISOString(),
              runId: simRun.id,
              shots: simRun.shots,
              backend: simRun.backend,
              framework: simRun.framework,
              seed: Math.floor(Math.random() * 99999),
            }
          }
        });
      }
    }`
);

fs.writeFileSync(file, content);
console.log("Updated experimentController.js");
