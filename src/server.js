const Koa = require('koa');
const cors = require('@koa/cors');
const KoaRouter = require('koa-router');
const bodyParser = require('koa-bodyparser');
const { graphqlKoa, graphiqlKoa } = require('apollo-server-koa');

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
