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

  // Type
  User: {
    id: ({ _id, id }) => _id || id
  }
};
