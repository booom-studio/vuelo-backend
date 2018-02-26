const { first } = require('lodash');

const CUBE_ACTIVE_INTERVAL = 5000; // 5 sec

module.exports = {
  // Queries
  allUsers: async (root, data, { mongo: { Users } }) => {
    return await Users.find().toArray();
  },
  cubeInfo: async (root, data, { user: { cubeId, lastCubeUpdate } }) => {
    let status;

    if (!lastCubeUpdate) {
      status = 'unconfirmed';
    } else if (Date.now() - lastCubeUpdate < CUBE_ACTIVE_INTERVAL) {
      status = 'connected';
    } else {
      status = 'not-connected';
    }

    return {
      cubeId,
      status
    };
  },

  // Mutations
  createUser: async (root, { name, email, password }, { mongo: { Users } }) => {
    const user = { name, email, password };
    const { insertedIds } = await Users.insert(user);

    return Object.assign({ id: first(insertedIds) }, user);
  },
  setCubeId: async (root, { cubeId }, { user, mongo: { Users } }) => {
    await Users.updateOne({ _id: user.id }, { $set: { cubeId } });

    return Object.assign({}, user, { cubeId });
  },

  // Type
  User: {
    id: ({ _id, id }) => _id || id
  }
};
