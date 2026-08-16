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
import userRouter from "./routes/userRouter.js"
import uploadRouter from "./routes/uploadRouter.js"
import chapaRouter from "./routes/chapaRouter.js"
import googleAuthRouter from "./routes/googleAuthRouter.js";
import passwordResetRouter from "./routes/passwordResetRouter.js"
import dns from "node:dns"
dns.setDefaultResultOrder("ipv4first")
dotenv.config();
connectDB();


const app = express();

app.use(cors());
app.use(
  express.json({
    verify: (req, res, buf) => {
      req.rawBody = Buffer.from(buf);
    },
  })
);

app.use('/api', passwordResetRouter);

app.use("/api/auth", googleAuthRouter);
app.use('/api', chapaRouter);
app.use('/api', uploadRouter);
app.use('/api', productRouter);
app.use('/api', sinupRouter);
app.use('/api',loginRouter)
app.use('/api',cartRouter)
app.use('/api',WhislistRouter)
app.use("/api",orderRouter)
app.use("/api",userRouter)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));