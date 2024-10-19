"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
// import helmet from 'helmet';
const helmet = require("helmet");
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const crypto_1 = __importDefault(require("crypto"));
// import authRoutes from './routes/auth';
const errorHandler_1 = require("./middleware/errorHandler");
const redis_1 = require("./helpers/redis");
const prisma_1 = require("./helpers/prisma");
// import { errorHandler } from './middleware/errorHandler';
/* ROUTE IMPORTS */
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const dashboardRoutes_1 = __importDefault(require("./routes/dashboardRoutes"));
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const expenseRoutes_1 = __importDefault(require("./routes/expenseRoutes"));
const purchaseRoutes_1 = __importDefault(require("./routes/purchaseRoutes"));
const authMiddleware_1 = require("./middleware/authMiddleware");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(helmet());
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 100
});
app.use(limiter);
const sessionSecret = crypto_1.default.randomBytes(32).toString('hex');
app.use((0, express_session_1.default)({
    store: redis_1.RedisStore,
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
app.use('/auth', authRoutes_1.default);
app.use("/dashboard", authMiddleware_1.protect, dashboardRoutes_1.default); // http://localhost:8000/dashboard
app.use("/products", authMiddleware_1.protect, productRoutes_1.default); // http://localhost:8000/products
app.use("/users", authMiddleware_1.protect, userRoutes_1.default); // http://localhost:8000/users
app.use("/expenses", authMiddleware_1.protect, expenseRoutes_1.default); // http://localhost:8000/expenses
app.use("/sales", authMiddleware_1.protect, purchaseRoutes_1.default); // http://localhost:8000/expenses
app.use(errorHandler_1.errorHandler);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
process.on('SIGINT', () => {
    redis_1.redisClient.quit();
    prisma_1.prisma.$disconnect();
    process.exit();
});
