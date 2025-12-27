import express from 'express'
import * as dotenv from 'dotenv';
import authRoutes from "./routes/auth.route.js";
import productRoutes from "./routes/product.route.js";
dotenv.config();

const app = express()
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

app.use((err, req, res, next) => {
  console.error(err);

  res.status(500).json({
    message: err.message || "Internal Server Error",
  });
});


app.get('/', (_req, res) => {
  res.send('Hello Express!')
})

export default app
