import { Request, Response } from 'express';
import UserModel from '@models/User';
import { userSchema } from '@schemas/user/userSchema';
import z from 'zod';
import { loginSchema } from '@schemas/user/loginSchema';
import { getUserFromToken } from '../passport';

class AuthController {
    public static async register(
        req: Request,
        res: Response,
    ): Promise<Response> {
        try {
            const userData = userSchema.parse(req.body);

            const existingUser = await UserModel.findOne({
                email: userData.email,
            });
            if (existingUser) {
                return res
                    .status(400)
                    .json({ message: 'Email is already in use' });
            }

            const user = new UserModel(userData);
            await user.save();

            return res
                .status(201)
                .json({ message: 'User registered successfully' });
        } catch (e) {
            if (e instanceof z.ZodError) {
                return res.status(400).json({ errors: e.errors });
            }
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    public static async login(req: Request, res: Response): Promise<Response> {
        try {
            const data = loginSchema.parse(req.body);

            const user = await UserModel.findOne({ username: data.username });

            if (!user)
                return res.status(404).json({ message: 'User not found' });

            const isMatch = await user.checkPassword(data.password);

            if (!isMatch)
                return res.status(401).json({ message: 'Invalid credentials' });

            return res.status(200).json({ token: user.generateJWT() });
        } catch (e) {
            if (e instanceof z.ZodError) {
                return res.status(400).json({ errors: e.errors });
            }
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    public static async me(req: Request, res: Response): Promise<Response> {
        try {
            const user = req.user;
            return res.status(200).json({ user });
        } catch (error) {
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }
}

export default AuthController;
