const fs = require('fs');
const path = require('path');

// Define the Netlify configuration content
const netlifyConfig = `[build]
  base = "client"
  publish = "build"
  command = "npm install --legacy-peer-deps && npm run build"

[functions]
  directory = "netlify/functions"

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

[dev]
  command = "npm run start"
  targetPort = 3000
`;

// Define the path for netlify.toml
const filePath = path.join(__dirname, 'netlify.toml');

// Write the configuration to netlify.toml
fs.writeFileSync(filePath, netlifyConfig, 'utf8');

console.log('✅ netlify.toml file has been successfully created!');
