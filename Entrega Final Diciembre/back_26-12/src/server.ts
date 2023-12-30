import express from "express";
import mongoose from "mongoose";
import apiRoutes from "./routes/api";

const app = express();
const PORT = process.env.PORT || 3001;

// Conectar a la base de datos MongoDB
mongoose.connect("mongodb://localhost:27017/myapp", {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

// Configurar middleware y rutas
app.use(express.json());
app.use("/api", apiRoutes);

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
