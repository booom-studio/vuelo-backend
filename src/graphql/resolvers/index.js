const { refreshToken, signIn, signInGoogle, authMiddleware } = require('./auth');
const { allUsers, User } = require('./users');
const { allProjects, createProject, Project } = require('./projects');

module.exports = {
  Query: {
    allUsers,
    allProjects: authMiddleware({ role: 'ADMIN' }, allProjects)
  },
  Mutation: {
    refreshToken,
    signIn,
    signInGoogle,
    createProject: authMiddleware({ role: 'ADMIN' }, createProject)
  },
  User,
  Project
};
