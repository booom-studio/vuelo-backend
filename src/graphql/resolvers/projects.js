const config = require('config');
const { ObjectId } = require('mongodb');
const { first, sample } = require('lodash');

module.exports = {
  // Queries
  async allProjects(root, data, { user, mongo: { Projects } }) {
    const projects = await Projects.find({ userId: user.id }).toArray();

    return projects;
  },

  // Mutations
  async createProject(root, { title }, { user, mongo: { Projects, Config } }) {
    const { colors } = await Config.findOne({
      key: config.get('colorsConfigKey')
    });
    const color = sample(Object.keys(colors));

    const project = {
      title,
      color,
      userId: user._id
    };

    const { insertedIds } = await Projects.insert(project);
    const newProject = Object.assign({}, { id: first(insertedIds) }, project);

    return newProject;
  },
  async updateProject(
    root,
    { id, ...updateWith },
    { user, mongo: { Projects } }
  ) {
    const project = await Projects.findOne({
      _id: ObjectId(id),
      userId: user.id
    });

    if (!project) {
      throw new Error('Project not found!');
    }

    await Projects.updateOne(project, { $set: updateWith });

    return { ...project, ...updateWith };
  },

  // Type
  Project: {
    id: ({ _id, id }) => _id || id
  }
};
