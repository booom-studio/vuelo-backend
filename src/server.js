const Koa = require('koa');
const cors = require('@koa/cors');
const KoaRouter = require('koa-router');
const bodyParser = require('koa-bodyparser');
const { graphqlKoa, graphiqlKoa } = require('apollo-server-koa');

const schema = require('./schema');

const PORT = 3000;

const app = new Koa();
const router = new KoaRouter();

router.get('/', (ctx) => {
  ctx.body = 'Hello Vuelo!';
});

app.use(cors());

app.use(bodyParser({
  extendTypes: {
    json: ['text/plain']
  }
}));

router.post('/graphql', graphqlKoa({ schema }));
router.get('/graphiql', graphiqlKoa({ endpointURL: '/graphql' }));

app
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(PORT);

console.log(`Server listening on localhost:${PORT}`);
