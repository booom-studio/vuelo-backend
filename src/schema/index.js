const { makeExecutableSchema } = require('graphql-tools');

const resolvers = require('./resolvers');

const typeDefs = `
  enum Role {
    ADMIN
    CLIENT
  }

  type User {
    id: ID!
    name: String!
  }

  type Query {
    allUsers: [User!]!
  }

  type Mutation {
    createUser(name: String!): User
  }
`;

module.exports = makeExecutableSchema({ typeDefs, resolvers });
