module.exports = {
  // Queries
  allUsers: async (root, data, { mongo: { Users } }) => {
    return await Users.find().toArray();
  },

  // Type
  User: {
    id: ({ _id, id }) => _id || id
  }
};
