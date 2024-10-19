import express from 'express';
import session from 'express-session';
// import helmet from 'helmet';
const helmet = require("helmet")
import rateLimit from 'express-rate-limit';
import crypto from 'crypto';
// import authRoutes from './routes/auth';
import { errorHandler } from './middleware/errorHandler';
import { redisClient, RedisStore } from './helpers/redis';
import { prisma } from './helpers/prisma';
// import { errorHandler } from './middleware/errorHandler';

/* ROUTE IMPORTS */
import authRoutes from "./routes/authRoutes";
import dashboardRoutes from "./routes/dashboardRoutes";
import productRoutes from "./routes/productRoutes";
import userRoutes from "./routes/userRoutes";
import expenseRoutes from "./routes/expenseRoutes";
import purchaseRoutes from "./routes/purchaseRoutes";
import { protect } from './middleware/authMiddleware';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use(limiter);

const sessionSecret = crypto.randomBytes(32).toString('hex');
app.use(session({
  store: RedisStore,
  secret: sessionSecret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000
  }
}));

app.use('/auth', authRoutes);
app.use("/dashboard", protect, dashboardRoutes); // http://localhost:8000/dashboard
app.use("/products", protect, productRoutes); // http://localhost:8000/products
app.use("/users", protect, userRoutes); // http://localhost:8000/users
app.use("/expenses", protect, expenseRoutes); // http://localhost:8000/expenses
app.use("/sales", protect, purchaseRoutes); // http://localhost:8000/expenses


app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

process.on('SIGINT', () => {
  redisClient.quit();
  prisma.$disconnect();
  process.exit();
});