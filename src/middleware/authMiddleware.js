"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.protect = void 0;
const protect = (req, res, next) => {
    if (!req.session.userId) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    next();
};
exports.protect = protect;
