const {
  refreshToken,
  signIn,
  signInGoogle
  // authMiddleware
} = require('./auth');
const { allUsers, User } = require('./users');
const { allProjects, createProject, Project } = require('./projects');
const { currentTimeEntry, TimeEntry } = require('./timeEntries');

module.exports = {
  Query: {
    allUsers,
    allProjects,
    currentTimeEntry
    // adminStuff: authMiddleware({ role: 'ADMIN' }, allProjects)
  },
  Mutation: {
    refreshToken,
    signIn,
    signInGoogle,
    createProject
  },
  User,
  Project,
  TimeEntry
};
