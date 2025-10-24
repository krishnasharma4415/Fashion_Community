// Script to update all hardcoded localhost URLs to use API configuration
import fs from 'fs';
import path from 'path';

const files = [
  'src/pages/ProfilePage.jsx',
  'src/pages/PostCreation.jsx',
  'src/pages/UserProfile.jsx',
  'src/components/Suggestions.jsx',
  'src/components/PostDetails.jsx',
  'src/components/PostCard.jsx',
  'src/components/ExplorePostCard.jsx'
];

const replacements = [
  {
    from: /import\s+([^;]+from\s+['"][^'"]*['"];?\s*)/,
    to: (match, imports) => `${imports}\nimport { getApiUrl } from '../config/api.js';\n`,
    addImport: true
  },
  {
    from: /http:\/\/localhost:5000\/api\/([^'"]+)/g,
    to: (match, endpoint) => `getApiUrl('/api/${endpoint}')`
  },
  {
    from: /http:\/\/localhost:5000/g,
    to: 'getApiUrl("")'
  }
];

files.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Add import if not present
    if (!content.includes("import { getApiUrl }")) {
      const importMatch = content.match(/import[^;]+;/);
      if (importMatch) {
        const lastImport = importMatch[importMatch.length - 1];
        content = content.replace(lastImport, lastImport + "\nimport { getApiUrl } from '../config/api.js';");
      }
    }
    
    // Replace URLs
    content = content.replace(/http:\/\/localhost:5000\/api\/([^'"]+)/g, (match, endpoint) => {
      return `getApiUrl('/api/${endpoint}')`;
    });
    
    content = content.replace(/http:\/\/localhost:5000(?!\/api)/g, (match) => {
      return 'getApiUrl("")';
    });
    
    fs.writeFileSync(filePath, content);
    console.log(`Updated ${file}`);
  }
});

console.log('All files updated!');