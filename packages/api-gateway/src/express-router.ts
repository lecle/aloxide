import { AloxideDataManager } from '@aloxide/demux';
import express from 'express';

import type { AloxideConfig } from '@aloxide/abstraction';
import type { Logger, DMeta, QueryInput } from '@aloxide/demux';
export interface CreateRouterConfig {
  aloxideConfig: AloxideConfig;
  dataAdapter: AloxideDataManager;
  logger?: Logger;
}

function createRouter(config: CreateRouterConfig) {
  if (!config || !config.dataAdapter || !config.aloxideConfig) {
    throw new Error('"dataAdapter" and "aloxideConfig" config are required');
  }

  const {
    aloxideConfig: { entities },
    dataAdapter,
    logger,
  } = config;

  dataAdapter.verify(entities.map(({ name }) => name));

  const expressRouter = express.Router();

  entities.forEach(entity => {
    const { name } = entity;
    logger?.debug('create route for entity:', name);

    const metaData: DMeta = {
      entity,
    };

    // add pagination API
    expressRouter.get(`/${name.toLowerCase()}s`, (req, res) => {
      const queryInput: QueryInput = {
        limit: req.query.limit,
        after: req.query.after as string,
      };

      Promise.all<any>([
        dataAdapter.count(name),
        dataAdapter.findAll(name, queryInput, metaData),
      ]).then(pa => {
        const [total, items] = pa;

        res.send({
          total,
          items,
        });
      });
    });

    // this is get by id
    expressRouter.get(`/${name.toLowerCase()}s/:id`, (req, res) => {
      dataAdapter.find(name, req.params.id, metaData).then(item => {
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
        tags: entities.map(e => ({
          name: e.name,
          // @ts-ignore
          description: e.description,
        })),
        schemes: ['http', 'https'],
        paths: entities
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

        definitions: entities
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
