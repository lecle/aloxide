import { AloxideConfig } from '@aloxide/abstraction';
import { ModelBuilder } from '@aloxide/model';
import express from 'express';
import { Op } from 'sequelize';

import type { Logger } from '@aloxide/logger';
import type { Sequelize } from 'sequelize/types';

export interface CreateRouterConfig {
  aloxideConfigPath: string;
  sequelize: Sequelize;
  logger?: Logger;
}

function createRouter(config: CreateRouterConfig) {
  const { aloxideConfigPath, sequelize, logger } = config;

  const modelBuilder = new ModelBuilder({
    aloxideConfigPath,
    logger,
  });

  modelBuilder.build(sequelize);

  const aloxideConfig: AloxideConfig = modelBuilder.aloxideConfig;

  const expressRouter = express.Router();

  aloxideConfig.entities.forEach(({ name }) => {
    // add pagination API
    expressRouter.get(`/${name.toLowerCase()}s`, (req, res) => {
      const model = sequelize.models[name];
      const [pk] = model.primaryKeyAttributes;
      const { limit, after } = req.query;
      Promise.all<any>([
        model.count(),
        model.findAll({
          limit: limit && parseInt(limit as string, 10),
          where: after && {
            [pk]: {
              [Op.gt]: after,
            },
          },
        }),
      ]).then(pa => {
        const [total, items] = pa;

        res.send({
          total,
          items,
          limit,
          after,
        });
      });
    });

    // this is get by id
    expressRouter.get(`/${name.toLowerCase()}s/:id`, (req, res) => {
      const model = sequelize.models[name];
      model.findByPk(req.params.id).then(item => {
        res.send({
          item,
        });
      });
    });

    expressRouter.get('/', (req, res) => {
      const reDocHtml = `<!DOCTYPE html>
      <html>
        <head>
          <title>api-gateway-reDoc</title>
          <meta charset="utf-8"/>
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <link href="https://fonts.googleapis.com/css?family=Montserrat:300,400,700|Roboto:300,400,700" rel="stylesheet">
          <style>
            body {
              margin: 0;
              padding: 0;
            }
          </style>
        </head>
        <body id="id-redoc-body">
          <script>
            var el = document.createElement('redoc');
            el.setAttribute('spec-url', \`\${location.pathname}/v1/swagger.json\`);
            document.getElementById('id-redoc-body').appendChild(el);
          </script>

          <script src="https://unpkg.com/redoc@latest/bundles/redoc.standalone.js"></script>
        </body>
      </html>`;
      res.setHeader('content-type', 'text/html');
      res.send(reDocHtml);
    });

    expressRouter.get('/v1/swagger.json', (req, res) => {
      const swaggerJson = {
        swagger: '2.0',
        info: {
          description: 'api-gateway-swagger',
          version: '1.0.0',
          title: 'api-gateway',
          termsOfService: '',
          license: {
            name: 'Apache 2.0',
            url: 'http://www.apache.org/licenses/LICENSE-2.0.html',
          },
        },
        basePath: '/api-gateway',
        tags: aloxideConfig.entities.map(e => ({
          name: e.name,
          // @ts-ignore
          description: e.description,
        })),
        schemes: ['http', 'https'],
        paths: aloxideConfig.entities
          .map(e => {
            return {
              [`/${e.name.toLowerCase()}s`]: {
                get: {
                  tags: [e.name],
                  summary: `Fill all ${e.name}s`,
                  description: '',
                  operationId: `find-all-${e.name}`,
                  produces: ['application/json'],
                  parameters: [
                    {
                      name: 'limit',
                      in: 'query',
                      description: 'paging size',
                      required: true,
                      type: 'integer',
                    },
                    {
                      name: 'after',
                      in: 'query',
                      description: `query items with primary key [${e.key}] > after`,
                      required: false,
                      type: 'string',
                    },
                  ],
                  responses: {
                    '200': {
                      description: 'successful operation',
                      schema: {
                        $ref: `#/definitions/${e.name}`,
                      },
                    },
                  },
                },
              },
              [`/${e.name.toLowerCase()}s/{id}`]: {
                get: {
                  tags: [e.name],
                  summary: `Find pet by ${e.key}`,
                  description: `Returns a single ${e.name}`,
                  operationId: `get-by-id-${e.name}`,
                  produces: ['application/json'],
                  parameters: [
                    {
                      name: 'id',
                      in: 'path',
                      required: true,
                      type: e.fields.find(f => f.name === e.key)?.type,
                    },
                  ],
                  responses: {
                    '200': {
                      description: 'successful operation',
                      schema: {
                        type: 'object',
                        properties: {
                          total: {
                            type: 'interger',
                          },
                          items: {
                            type: 'array',
                            items: {
                              $ref: `#/definitions/${e.name}`,
                            },
                          },
                          limit: { type: 'integer' },
                          after: { type: e.fields.find(f => f.name === e.key)?.type },
                        },
                      },
                    },
                    '404': {
                      description: 'not found',
                    },
                  },
                },
              },
            };
          })
          .reduce((a, c) => Object.assign(a, c)),

        definitions: aloxideConfig.entities
          .map(e => {
            return {
              [e.name]: {
                type: 'object',
                properties: e.fields
                  .map(f => ({
                    [f.name]: {
                      type: f.type,
                    },
                  }))
                  .reduce((a, c) => Object.assign(a, c)),
              },
            };
          })
          .reduce((a, c) => Object.assign(a, c)),
      };
      res.send(swaggerJson);
    });
  });

  return expressRouter;
}

export { createRouter };
