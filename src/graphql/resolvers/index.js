const {
  refreshToken,
  signIn,
  signInGoogle
  // authMiddleware
} = require('./auth');
const { allUsers, createUser, setCubeId, User } = require('./users');
const { allProjects, createProject, Project } = require('./projects');
const { currentTimeEntry, toggle, TimeEntry } = require('./timeEntries');

module.exports = {
  Query: {
    allUsers,
    allProjects,
    currentTimeEntry

    // adminStuff: authMiddleware({ role: 'ADMIN' }, allProjects)
  },
  Mutation: {
    createUser,
    refreshToken,
    signIn,
    signInGoogle,
    createProject,
    setCubeId,
    toggle
  },
  User,
  Project,
  TimeEntry
};
