const users = require('./mock-users');

module.exports = {
  Query: {
    allUsers: () => users
  },
  Mutation: {
    createUser: (_, data) => {
      const user = Object.assign({}, data, { id: users.length + 1 });
      users.push(user);

      return user;
    }
  }
};
