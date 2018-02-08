const fs = require('fs');

const configPath = './config.json';
const parsed = JSON.parse(fs.readFileSync(configPath, 'UFT-8'));

// We have to export each object in order to access them separetely
exports.crypto = parsed.crypto;
exports.expressSession = parsed.expressSession;
exports.mailgun = parsed.mailgun;
exports.port = parsed.port;