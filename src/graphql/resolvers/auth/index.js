const { first, pick } = require('lodash');

const { ObjectId } = require('mongodb');

const simpleAuth = require('./simple-auth')();
const googleAuth = require('./google-auth')();

const generateToken = ({ id, _id }) => simpleAuth.getToken({ id: id || _id });

module.exports = {
  // Mutations
  refreshToken: async (root, data, { user }) => ({
    token: generateToken(user),
    user
  }),
  async signInGoogle(root, { token }, { mongo: { Projects, Users } }) {
    const user = await googleAuth.verify(token);

    const existingUser = await Users.findOne({ email: user.email });
    if (existingUser) {
      // TODO update user info
      console.log('User already exists');

      return {
        token: generateToken(existingUser),
        user: existingUser
      };
    }

    const newUser = pick(user, 'email', 'name', 'picture');

    const { insertedIds } = await Users.insert(newUser);

    const id = first(insertedIds);

    await Projects.insert({
      title: 'My first Project',
      color: '#ccff90',
      userId: id
    });

    return {
      user: Object.assign({ id }, newUser),
      token: generateToken(newUser)
    };
  },
  async signIn(root, { email, password }, { mongo: { Users } }) {
    // TODO, plain pw..
    const user = await Users.findOne({ email, password });

    if (!user) {
      throw new Error('User not found!');
    }

    return {
      user,
      token: generateToken(user)
    };
  },

  userMiddleware: resolver => async (root, data, context) => {
    const { authorization: token, mongo: { Users } } = context;

    const { id } = simpleAuth.verifyToken(token);

    const user = await Users.findOne({ _id: ObjectId(id) });

    if (!user) {
      throw new Error('User not found');
    }

    Object.assign(user, { id: user._id });

    return await resolver(root, data, { ...context, user });
  },

  // Middleware
  authMiddleware(scope, resolver) {
    return async (root, data, context) => {
      try {
        simpleAuth.verify(context.authorization);

        return await resolver(root, data, context);
      } catch (err) {
        console.log('not valid', err);
        throw new Error('Unathorized');
      }
    };
  }
};
