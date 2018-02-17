const { first } = require('lodash');

const simpleAuth = require('../auth/simple-auth')();

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
  setCubeId: async (
    root,
    { cubeId },
    { authorization: token, mongo: { Users } }
  ) => {
    const { email } = simpleAuth.verifyToken(token);
    const user = await Users.findOne({ email });

    if (!user) {
      throw new Error('User not found');
    }

    await Users.updateOne(user, { $set: { cubeId } });

    return Object.assign({}, user, { cubeId });
  },

  // Type
  User: {
    id: ({ _id, id }) => _id || id
  }
};
