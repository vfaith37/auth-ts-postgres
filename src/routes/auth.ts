import express from 'express';
// import { register, login, logout } from '../controllers/authController';
import { protect } from '../middleware/authMiddleware';
import { login, logout, register } from '../controllers/authController';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/protected', protect, (req, res) => {
  res.json({ message: 'This is a protected route', user: req.session.userId });
});

export default router;