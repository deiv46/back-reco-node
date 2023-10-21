const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de favoritos Recomotor',
      version: '1.0.0',
    },
    components: { // Agrega la sección "components" aquí
      schemas: {
        DashboardData: {
          type: 'object',
          properties: {
            cochesPorUsuario: {
              type: 'object',
              additionalProperties: {
                type: 'object',
                properties: {
                  numCoches: { type: 'integer' },
                  coches: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        marca: { type: 'string' },
                        modelo: { type: 'string' },
                      },
                    },
                  },
                },
              },
            },
            rankingMarcas: {
              type: 'object',
              additionalProperties: { type: 'integer' },
            },
            rankingModelos: {
              type: 'object',
              additionalProperties: { type: 'integer' },
            },
          },
        },
      },
    },
  },
  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
