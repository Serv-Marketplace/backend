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

// app.get('/api/users/:id', (_req, res) => {
//   res.json({ id: _req.params.id })
// })

// app.get('/api/posts/:postId/comments/:commentId', (_req, res) => {
//   res.json({ postId: _req.params.postId, commentId: _req.params.commentId })
// })

export default app
