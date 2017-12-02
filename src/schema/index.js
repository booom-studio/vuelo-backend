const { readFileSync } = require('fs');
const { resolve: resolvePath } = require('path');
const { makeExecutableSchema } = require('graphql-tools');

const resolvers = require('./resolvers');

const typeDefs = readFileSync(resolvePath(__dirname, './User.graphql'), 'utf8');

module.exports = makeExecutableSchema({ typeDefs, resolvers });
