import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import sinupRouter from './routes/SignUpRouter.js'
import loginRouter from './routes/LoginRouter.js'
import cartRouter from './routes/CartRouter.js'
import productRouter from "./routes/productRouter.js"
import WhislistRouter from "./routes/wishlistRouter.js"
import orderRouter from "./routes/orderRouter.js"
dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', productRouter);
app.use('/api', sinupRouter);
app.use('/api',loginRouter)
app.use('/api',cartRouter)
app.use('/api',WhislistRouter)
app.use("/api",orderRouter)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));