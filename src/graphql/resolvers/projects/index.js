const { first } = require('lodash');

const simpleAuth = require('../auth/simple-auth')();

module.exports = {
  // Queries
  async allProjects(root, data, { mongo: { Projects } }) {
    return await Projects.find().toArray();
  },

  // Mutations
  async createProject(
    root,
    project,
    { authorization: token, mongo: { Users, Projects } }
  ) {
    const { email } = simpleAuth.verifyToken(token);
    const user = await Users.findOne({ email });

    if (!user) {
      throw new Error('User not found');
    }

    const { insertedIds } = await Projects.insert(project);

    const newProject = Object.assign({ id: first(insertedIds) }, project);

    await Users.updateOne(user, { $push: { projects: newProject } });

    return newProject;
  },

  // Type
  Project: {
    id: ({ _id, id }) => _id || id
  }
};
