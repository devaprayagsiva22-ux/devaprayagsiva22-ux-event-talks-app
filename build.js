const fs = require('fs');
const path = require('path');

const talksData = require('./talksData.js').talksData; // Ensure talksData is exported as talksData

const htmlTemplatePath = path.join(__dirname, 'src', 'index.html');
const cssPath = path.join(__dirname, 'src', 'style.css');
const appScriptPath = path.join(__dirname, 'src', 'app.js');

const outputPath = path.join(__dirname, 'index.html');

// Read template files
const htmlTemplate = fs.readFileSync(htmlTemplatePath, 'utf8');
const cssContent = fs.readFileSync(cssPath, 'utf8');
const appScriptContent = fs.readFileSync(appScriptPath, 'utf8');

// Embed data, CSS, and JS into the HTML template
let finalHtml = htmlTemplate
    .replace('<style id="injected-styles"></style>', `<style>${cssContent}</style>`)
    .replace('<script id="injected-talks-data"></script>', `<script>window.talksData = ${JSON.stringify(talksData, null, 2)};</script>`)
    .replace('<script id="injected-app-script"></script>', `<script>${appScriptContent}</script>`);

// Write the final HTML file
fs.writeFileSync(outputPath, finalHtml, 'utf8');

console.log(`Successfully generated single-page website at ${outputPath}`);
