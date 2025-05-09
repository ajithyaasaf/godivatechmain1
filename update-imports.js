// A simple script to update imports in the client code
// Run with: node update-imports.js

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to recursively get all .ts and .tsx files in a directory
function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach(file => {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
    } else {
      if (file.endsWith('.ts') || file.endsWith('.tsx')) {
        arrayOfFiles.push(path.join(dirPath, "/", file));
      }
    }
  });

  return arrayOfFiles;
}

// Process each file to update imports
async function processFiles() {
  const clientSrcDir = path.join(__dirname, 'client', 'src');
  const files = getAllFiles(clientSrcDir);
  
  console.log(`Found ${files.length} TypeScript files to process`);
  
  let updatedFiles = 0;
  
  for (const file of files) {
    // Skip the schema.ts file itself
    if (file.includes('client/src/lib/schema.ts')) continue;
    
    const content = fs.readFileSync(file, 'utf8');
    
    // Look for imports from @shared/schema.ts
    if (content.includes('@shared/schema') || content.includes('../shared/schema')) {
      console.log(`Processing ${file}`);
      
      // Replace imports while maintaining the structure
      const updatedContent = content
        .replace(/@shared\/schema/g, '@/lib/schema')
        .replace(/\.\.\/shared\/schema/g, '@/lib/schema');
      
      if (updatedContent !== content) {
        fs.writeFileSync(file, updatedContent, 'utf8');
        updatedFiles++;
        console.log(`  - Updated imports in ${file}`);
      }
    }
  }
  
  console.log(`Successfully updated imports in ${updatedFiles} files`);
}

// Execute the script
processFiles().catch(err => {
  console.error('Error processing files:', err);
  process.exit(1);
});