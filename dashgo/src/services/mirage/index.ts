/* eslint-disable import/no-extraneous-dependencies */
import { createServer, Factory, Model } from 'miragejs';
import faker from 'faker';

interface User {
  name: string;
  email: string;
  created_at: string;
}

export function makeServer() {
  const mirageServer = createServer({
    models: {
      user: Model.extend<Partial<User>>({}),
    },

    factories: {
      user: Factory.extend({
        name(i: number) {
          return `User ${i + 1}`;
        },
        email() {
          return faker.internet.email().toLowerCase();
        },
        createdAt() {
          return faker.date.recent(10);
        },
      }),
    },

    seeds(server) {
      server.createList('user', 200);
    },

    routes() {
      this.namespace = 'api';
      this.timing = 750;

      this.get('/users');
      this.post('/users');

      this.namespace = '';
      this.passthrough();
    },
  });

  return mirageServer;
}
