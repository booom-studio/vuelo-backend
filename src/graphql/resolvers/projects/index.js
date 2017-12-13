const { first } = require('lodash');

module.exports = {
  // Queries
  async allProjects (root, data, { mongo: { Projects } }) {
    return await Projects.find().toArray();
  },

  // Mutations
  async createProject (root, project, { mongo: { Projects } }) {
    const { insertedIds } = await Projects.insert(project);

    return Object.assign({ id: first(insertedIds) }, project);
  },

  // Type
  Project: {
    id: ({ _id, id }) => _id || id
  }
};
