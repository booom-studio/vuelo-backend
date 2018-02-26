const {
  refreshToken,
  signIn,
  signInGoogle,
  userMiddleware
  // authMiddleware
} = require('./auth');
const { allUsers, createUser, setCubeId, User } = require('./users');
const {
  allProjects,
  createProject,
  updateProject,
  Project
} = require('./projects');
const { currentTimeEntry, toggle, TimeEntry } = require('./timeEntries');

const { colors } = require('./common');

module.exports = {
  Query: {
    allUsers,
    allProjects: userMiddleware(allProjects),
    currentTimeEntry: userMiddleware(currentTimeEntry),
    colors
    // adminStuff: authMiddleware({ role: 'ADMIN' }, allProjects)
  },
  Mutation: {
    signIn,
    signInGoogle,
    createUser, // admin
    refreshToken: userMiddleware(refreshToken),
    createProject: userMiddleware(createProject),
    updateProject: userMiddleware(updateProject),
    setCubeId: userMiddleware(setCubeId),
    toggle: userMiddleware(toggle)
  },
  User,
  Project,
  TimeEntry
};
