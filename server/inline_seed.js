const fs = require('fs');

const dummyDataContent = fs.readFileSync('src/utils/dummyData.js', 'utf-8');
const seedContent = fs.readFileSync('prisma/seed.js', 'utf-8');

// Replace imports
let newSeed = seedContent.replace(/import \{.*\} from '.*dummyData\.js';/, dummyDataContent);

// Replace "generateDummyInstructorData" call
// Actually, it's easier to just append the data and call it locally.
newSeed = newSeed.replace("const dummy = generateDummyInstructorData(instructor.name);", 
"const dummy = generateDummyInstructorData(instructor.name);\nconst dummyLearner = generateDummyLearnerData(createdUsers['LEARNER'].name);");

fs.writeFileSync('prisma/seed.js', newSeed);
