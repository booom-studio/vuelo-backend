const Koa = require('koa');
const cors = require('@koa/cors');
const KoaRouter = require('koa-router');
const bodyParser = require('koa-bodyparser');
const { graphqlKoa, graphiqlKoa } = require('apollo-server-koa');

const schema = require('./schema');
const mongoConnector = require('./mongo-connector');

const PORT = 3001;

const start = async () => {
  const app = new Koa();
  const router = new KoaRouter();
  
  const mongo = await mongoConnector();
  
  router.post('/graphql', graphqlKoa({
    schema,
    context: { mongo }
  }));
  router.get('/graphiql', graphiqlKoa({ endpointURL: '/graphql' }));
  
  app.use(bodyParser({
    extendTypes: {
      json: ['text/plain']
    }
  }));
  app.use(cors());
  
  app
    .use(router.routes())
    .use(router.allowedMethods());
  
  app.listen(PORT);
  
  console.log(`Server listening on localhost:${PORT}`);
};

start();
