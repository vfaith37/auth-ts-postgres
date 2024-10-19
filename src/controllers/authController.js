"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.login = exports.register = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const validationShema_1 = require("../helpers/validationShema");
const prisma_1 = require("../helpers/prisma");
const register = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield validationShema_1.authSchema.validate(req.body);
        // Check if user already exists
        const doesExist = yield prisma_1.prisma.users.findUnique({
            where: { email: result.email },
        });
        if (doesExist) {
            return res.status(400).json({ message: 'User already exists' });
        }
        // Hash the password before saving
        const salt = yield bcrypt_1.default.genSalt(12);
        const hashedPassword = yield bcrypt_1.default.hash(result.password, salt);
        yield prisma_1.prisma.users.create({
            data: {
                firstname: result.firstname,
                lastname: result.lastname,
                email: result.email,
                password: hashedPassword,
            },
        });
        res.status(201).json({ message: 'User registered successfully' });
    }
    catch (error) {
        // if (error.isJoi === true) {
        //   return res.status(422).json({ message: 'Validation error', details: error.details });
        // }
        next(error);
    }
});
exports.register = register;
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield validationShema_1.signInSchema.validate(req.body);
        console.log(req.session);
        // Find user by email
        const user = yield prisma_1.prisma.users.findUnique({
            where: { email: result.email },
        });
        // If user not found
        if (!user) {
            return res.status(400).json({ message: 'Incorrect email or password' });
        }
        // Validate password
        const isMatch = bcrypt_1.default.compare(result.password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Incorrect email or password' });
        }
        console.log(req.session);
        req.session.userId = user.userId;
        res.json({ message: 'Logged in successfully', session: req.session });
    }
    catch (error) {
        // if (error.isJoi === true) {
        //   return res.status(422).json({ message: 'Validation error', details: error.details });
        // }
        next(error);
    }
});
exports.login = login;
const logout = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    req.session.destroy((err) => {
        if (err) {
            return next(err);
        }
        res.json({ message: 'Logged out successfully' });
    });
});
exports.logout = logout;
