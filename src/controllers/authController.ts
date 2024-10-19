import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import { authSchema, signInSchema } from '../helpers/validationShema';
import { prisma } from '../helpers/prisma';


interface UserRegistrationPayload {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
}
interface UserLoginPayload {
  email: string;
  password: string;
}

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result: UserRegistrationPayload = await authSchema.validate(req.body);

    // Check if user already exists
    const doesExist = await prisma.users.findUnique({
      where: { email: result.email },
    });
    if (doesExist) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password before saving
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(result.password, salt);
    await prisma.users.create({
      data: {
        firstname: result.firstname,
        lastname: result.lastname,
        email: result.email,
        password: hashedPassword,
      },
    });

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    // if (error.isJoi === true) {
    //   return res.status(422).json({ message: 'Validation error', details: error.details });
    // }
    next(error);
  }
}


export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result: UserLoginPayload = await signInSchema.validate(req.body);
    console.log(req.session);
    
    // Find user by email
    const user = await prisma.users.findUnique({
      where: { email: result.email },
    });

    // If user not found
    if (!user) {
      return res.status(400).json({ message: 'Incorrect email or password' });
    }

    // Validate password
    const isMatch = bcrypt.compare(result.password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect email or password' });
    }

    console.log(req.session);
    
    req.session.userId = user.userId
    
    res.json({ message: 'Logged in successfully', session: req.session });

  } catch (error) {
    // if (error.isJoi === true) {
    //   return res.status(422).json({ message: 'Validation error', details: error.details });
    // }
    next(error);
  }
}

export const logout = async (req: Request, res: Response, next: NextFunction) => {
  req.session.destroy((err) => {
    if (err) {
      return next(err);
    }
    res.json({ message: 'Logged out successfully' });
  });
}