import swaggerJSDoc from 'swagger-jsdoc';

const swaggerOptions: swaggerJSDoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Gestión de Proyectos',
            version: '1.0.0',
            description: 'API REST para gestión colaborativa de proyectos y tareas. Incluye autenticación JWT, CRUD de proyectos y tareas con estados y prioridades.',
            contact: {
                name: 'Soporte API',
                email: 'soporte@ejemplo.com'
            },
            license: {
                name: 'MIT',
                url: 'https://opensource.org/licenses/MIT'
            }
        },
        servers: [
            {
                url: 'http://localhost:8080',
                description: 'Servidor de Desarrollo'
            },
            {
                url: 'https://api-produccion.ejemplo.com',
                description: 'Servidor de Producción'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'Ingresa el token JWT obtenido del endpoint /auth/login'
                },
                cookieAuth: {
                    type: 'apiKey',
                    in: 'cookie',
                    name: 'ANGEL_AUTH',
                    description: 'Cookie de sesión generada automáticamente en login'
                }
            }
        }
    },
    apis: ['./src/router/*.ts']
};

export const swaggerSpec = swaggerJSDoc(swaggerOptions);