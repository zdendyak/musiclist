const fs = require('fs');

const configPath = './config.json';
const parsed = JSON.parse(fs.readFileSync(configPath, 'UTF-8'));

// We have to export each object in order to access them separetely
exports.crypto = parsed.crypto;
exports.discogs = parsed.discogs;
exports.expressSession = parsed.expressSession;
exports.mailgun = parsed.mailgun;
exports.port = parsed.port;
