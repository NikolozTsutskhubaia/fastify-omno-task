const fastify = require('fastify')({ logger: true });
const dotenv = require('dotenv');

dotenv.config();

fastify.register(require('@fastify/swagger'), {
  swagger: {
    info: { title: 'Omno API Integration', version: '1.0.0' },
    tags: [
      { name: 'Transaction', description: 'Transaction related endpoints' },
      { name: 'Webhook', description: 'Webhook related endpoints' }
    ],
  },
});

fastify.register(require('@fastify/swagger-ui'), {
  routePrefix: '/docs',
  exposeRoute: true,
});

fastify.register(require('./routes/createTransaction'));
fastify.register(require('./routes/webhook'));

const start = async () => {
  try {
    await fastify.listen({ port: 3000, host: '0.0.0.0' });
    console.log(`Server listening on ${fastify.server.address().port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();