const { first } = require('lodash');

module.exports = {
  // Queries
  allUsers: async (root, data, { mongo: { Users } }) => {
    return await Users.find().toArray();
  },

  // Mutations
  createUser: async (root, { name, email, password }, { mongo: { Users } }) => {
    const user = { name, email, password };
    const { insertedIds } = await Users.insert(user);

    return Object.assign({ id: first(insertedIds) }, user);
  },
  setCubeId: async (root, { cubeId }, { user, mongo: { Users } }) => {
    await Users.updateOne(user, { $set: { cubeId } });

    return Object.assign({}, user, { cubeId });
  },

  // Type
  User: {
    id: ({ _id, id }) => _id || id
  }
};
