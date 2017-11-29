const Koa = require('koa');
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

router.post('/graphql', graphqlKoa({ schema }));
router.get('/graphiql', graphiqlKoa({ endpointURL: '/graphql' }));

app.use(bodyParser());

app
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(PORT);

console.log(`Server listening on localhost:${PORT}`);
