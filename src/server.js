const Koa = require('koa');
const cors = require('@koa/cors');
const KoaRouter = require('koa-router');
const bodyParser = require('koa-bodyparser');
const { graphqlKoa, graphiqlKoa } = require('apollo-server-koa');

const { last, first } = require('lodash');

const schema = require('./graphql');
const mongoConnector = require('./mongo-connector');

const PORT = process.env.PORT || 3001;

const getBearerToken = token =>
  token ? token.replace(/^Bearer\s*/, '') : null;

const start = async () => {
  const app = new Koa();
  const router = new KoaRouter();

  const mongo = await mongoConnector();

  router.post(
    '/graphql',
    graphqlKoa(({ request: { header: { authorization } } }) => {
      return {
        schema,
        context: { mongo, authorization: getBearerToken(authorization) }
      };
    })
  );
  router.get('/graphiql', graphiqlKoa({ endpointURL: '/graphql' }));

  router.get('/status/:cubeId', async (ctx, next) => {
    const { Users, TimeEntries } = mongo;
    const { params: { cubeId } } = ctx;

    const user = await Users.findOne({ cubeId });

    if (!user) {
      throw new Error('User not found');
    }

    const lastTimeEntry = last(
      await TimeEntries.find({ userId: user.id }).toArray()
    );

    if (lastTimeEntry) {
      ctx.body = JSON.stringify(lastTimeEntry, null, 2);
      return;
    }

    ctx.body = JSON.stringify({ nope: 'nopp' }, null, 2);
  });

  router.get('/toggle/:cubeId', async (ctx, next) => {
    const { Users, TimeEntries } = mongo;
    const { params: { cubeId } } = ctx;

    const user = await Users.findOne({ cubeId });

    if (!user) {
      throw new Error('User not found');
    }

    const timeEntries = await TimeEntries.find({ userId: user.id }).toArray();

    const lastTimeEntry = last(timeEntries);

    if (lastTimeEntry && !lastTimeEntry.endTime) {
      const endTime = Date.now();

      await TimeEntries.update(lastTimeEntry, { $set: { endTime } });

      // TODO should we start anouther entry?

      ctx.body = JSON.stringify(
        Object.assign(
          {},
          lastTimeEntry,
          {
            endTime
          },
          null,
          2
        )
      );

      return;
    }

    if (lastTimeEntry) {
      const timeEntry = {
        projectId: lastTimeEntry.projectId,
        userId: lastTimeEntry.userId,
        startTime: Date.now()
      };

      const { insertedIds } = await TimeEntries.insert(timeEntry);

      const newTimeEntry = Object.assign({ id: first(insertedIds) }, timeEntry);

      ctx.body = JSON.stringify(newTimeEntry, null, 2);
      return;
    }

    return;
  });

  app.use(
    bodyParser({
      extendTypes: {
        // json: ['text/plain']
      }
    })
  );
  app.use(cors());

  app.use(router.routes()).use(router.allowedMethods());

  app.listen(PORT);

  console.log(`Server listening on localhost:${PORT}`);
};

start();
