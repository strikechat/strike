import { Request, Response } from 'express';
import UserModel from '@models/User';
import { userSchema } from '@schemas/user/userSchema';
import z from 'zod';

class AuthController {
  public static async register(req: Request, res: Response): Promise<Response> {
    try {
      const userData = userSchema.parse(req.body);

      const existingUser = await UserModel.findOne({ email: userData.email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email is already in use' });
      }

      const user = new UserModel(userData);
      await user.save();

      return res.status(201).json({ message: 'User registered successfully' });
    } catch (e) {
      if (e instanceof z.ZodError) {
        return res.status(400).json({ errors: e.errors });
      }
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }
}

export default AuthController;
