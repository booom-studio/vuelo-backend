const { first, pick } = require('lodash');

const simpleAuth = require('./simple-auth')();
const googleAuth = require('./google-auth')();

const generateToken = ({ email, id }) => simpleAuth.getToken({ email, id });

module.exports = {
  // Mutations
  async refreshToken(root, { oldToken }, { mongo: { Users } }) {
    const { email } = simpleAuth.verifyToken(oldToken);

    const user = await Users.findOne({ email });

    if (!user) {
      throw new Error('User not found');
    }

    console.log('refreshToken', { user });

    return {
      token: generateToken(user),
      user
    };
  },
  async signInGoogle(root, { token }, { mongo: { Users } }) {
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

    console.log({ user });

    const { insertedIds } = await Users.insert(newUser);

    return {
      user: Object.assign({ id: first(insertedIds) }, newUser),
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
