const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '..', 'public', 'index.html');
const workspacePath = path.join(__dirname, '..', 'public', 'workspace.html');

const indexHtml = fs.readFileSync(indexPath, 'utf-8');
const workspaceHtml = fs.readFileSync(workspacePath, 'utf-8');

// Extract footer from index.html
const footerMatch = indexHtml.match(/<footer class="footer">([\s\S]*?)<\/footer>/);
if (!footerMatch) {
  console.error('Footer not found in index.html');
  process.exit(1);
}

const footerHtml = footerMatch[0];

// Replace footer in workspace.html
const updatedWorkspace = workspaceHtml.replace(/<footer class="footer">[\s\S]*?<\/footer>/, footerHtml);

fs.writeFileSync(workspacePath, updatedWorkspace, 'utf-8');
console.log('Successfully synced footer to workspace.html');
