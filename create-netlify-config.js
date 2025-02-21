const fs = require('fs');
const path = require('path');

// Define Netlify configuration
const netlifyConfig = `
[build]
  base = "client"
  publish = "build"
  command = "npm install --legacy-peer-deps && npm run build"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200
  force = true

[[headers]]
  for = "/*"
  [headers.values]
    Access-Control-Allow-Origin = "*"
    Access-Control-Allow-Methods = "GET, POST, PUT, DELETE, OPTIONS"
    Access-Control-Allow-Headers = "Content-Type, Authorization"
`;

// Define the file path
const filePath = path.join(__dirname, 'netlify.toml');

// Write the file
fs.writeFileSync(filePath, netlifyConfig, 'utf8');

console.log('✅ netlify.toml file created successfully!');
