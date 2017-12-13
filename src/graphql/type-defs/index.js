const { readFileSync, readdirSync } = require('fs');
const { resolve: resolvePath } = require('path');

const files = readdirSync(resolvePath(__dirname));
const gqlFiles = files.filter(filename => /.*\.gql/.test(filename));

const typeDefs = gqlFiles.map(filename => {
  return readFileSync(resolvePath(__dirname, filename), 'utf8');
}).join('\n');

module.exports = typeDefs;
