const { first } = require('lodash');

module.exports = {
  Query: {
    allUsers: async (root, data, { mongo: { Users } }) => {
      return await Users.find().toArray();
    }
  },
  Mutation: {
    createUser: async (root, data, { mongo: { Users } }) => {
      const { insertedIds } = await Users.insert(data);

      const user = Object.assign({ id: first(insertedIds) }, data);
      return user;
    }
  },
  User: {
    id: ({ _id, id }) => _id || id
  }
};
