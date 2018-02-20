const { first } = require('lodash');

module.exports = {
  // Queries
  async allProjects(root, data, { user, mongo: { Projects } }) {
    const projects = await Projects.find({ userId: user.id }).toArray();

    console.log({ projects, userId: user.id, user });

    return projects;
  },

  // Mutations
  async createProject(root, { title, color }, { user, mongo: { Projects } }) {
    const project = {
      title,
      color,
      userId: user._id
    };

    const { insertedIds } = await Projects.insert(project);

    const newProject = Object.assign({}, { id: first(insertedIds) }, project);

    // await Users.updateOne(user, { $push: { projects: newProject } });

    // console.log({ newProject });

    return newProject;
  },

  // Type
  Project: {
    id: ({ _id, id }) => _id || id
  }
};
