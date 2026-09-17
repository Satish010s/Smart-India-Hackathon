const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'client/src/components/learner/ExperimentsView.jsx');
let content = fs.readFileSync(file, 'utf8');

// Import NewExperimentWizard
if (!content.includes('import NewExperimentWizard')) {
  content = content.replace(
    "import { apiFetch } from '../../services/api';",
    "import { apiFetch } from '../../services/api';\nimport NewExperimentWizard from './NewExperimentWizard';"
  );
}

// Remove CreateExperimentModal function completely
content = content.replace(/function CreateExperimentModal\([\s\S]*?return \([\s\S]*?<\/\div>\s*\);\s*\}/, '');

// Change rendering logic
content = content.replace(
  `  if (selected) {
    return <ExperimentDetail exp={selected} onBack={() => setSelected(null)} onRefresh={fetchExperiments} />;
  }`,
  `  if (showCreate) {
    return (
      <NewExperimentWizard
        onCancel={() => setShowCreate(false)}
        onComplete={(exp) => {
          setShowCreate(false);
          setExperiments(prev => [exp, ...prev]);
          setTotal(t => t + 1);
          setSelected(exp); // Optional: immediately open the saved experiment
        }}
      />
    );
  }

  if (selected) {
    return <ExperimentDetail exp={selected} onBack={() => setSelected(null)} onRefresh={fetchExperiments} />;
  }`
);

// Remove the old CreateExperimentModal rendering at the bottom
content = content.replace(
  `      {showCreate && (
        <CreateExperimentModal
          onClose={() => setShowCreate(false)}
          onCreate={exp => { setExperiments(prev => [exp, ...prev]); setTotal(t => t + 1); }}
        />
      )}`,
  ``
);

fs.writeFileSync(file, content);
console.log("Updated ExperimentsView.jsx");
