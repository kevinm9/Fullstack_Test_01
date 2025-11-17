import express from "express";
import http from "http";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import mongoose from "mongoose";
import swaggerUi from "swagger-ui-express";
import dotenv from "dotenv";
import router from "./router";
import { swaggerSpec } from "./config/config";

dotenv.config();

const app = express();

app.use(
  cors({
    credentials: true,
  })
);

app.use(bodyParser.json());
app.use(cookieParser());
app.use(compression());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: "API Gestión de Proyectos - Documentación"
}));

app.get("/api-docs.json", (_req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

app.route("/").get((_req, res) => {
  res.send("Hello World");
});

app.use("/api", router());

// Configuración de MongoDB
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/gestion-proyectos';
const PORT = process.env.PORT || 8080;

// Función para conectar a MongoDB y iniciar servidor
const startServer = async () => {
  try {
    // Conectar a MongoDB
    console.log('🔄 Conectando a MongoDB...');
    await mongoose.connect(MONGO_URI);

    console.log('✅ MongoDB conectado exitosamente');
    console.log(`📊 Base de datos: ${mongoose.connection.name}`);

    const server = http.createServer(app);

    server.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
      console.log(`📚 Documentación Swagger en http://localhost:${PORT}/api-docs`);
      console.log(`📄 OpenAPI JSON en http://localhost:${PORT}/api-docs.json`);
    });

    mongoose.connection.on('error', (err: Error) => {
      console.error('❌ Error de MongoDB:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️  MongoDB desconectado');
    });

  } catch (error) {
    console.error('❌ Error al conectar a MongoDB:', error);
    console.error('💡 Verifica que:');
    console.error('   1. MongoDB esté corriendo');
    console.error('   2. La URI en .env sea correcta');
    console.error('   3. Tienes acceso a la base de datos');
    process.exit(1);
  }
};

process.on('SIGINT', async () => {
  console.log('\nCerrando servidor...');
  await mongoose.connection.close();
  console.log('Conexión a MongoDB cerrada');
  process.exit(0);
});

startServer();
