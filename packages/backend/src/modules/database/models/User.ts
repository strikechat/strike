import { getModelForClass, prop, pre } from '@typegoose/typegoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

@pre<User>('save', async function () {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
})
class User {
    public _id!: mongoose.Types.ObjectId;
    @prop({ required: true })
    public username!: string;
    @prop({ required: true })
    public email!: string;
    @prop({ required: true })
    public password!: string;

    public async setPassword(password: string) {
        this.password = await bcrypt.hash(password, 10);
    }

    public async checkPassword(password: string) {
        return await bcrypt.compare(password, this.password);
    }

    public generateJWT() {
        return jwt.sign(
            { id: this._id, username: this.username, email: this.email },
            process.env.STRIKE_JWT_SECRET ?? 'secret',
            { expiresIn: '6h' },
        );
    }

    public getSafeUser() {
      //weird stuff as fuck but cant get it to work
      const { _id, username, email } = JSON.parse(JSON.stringify(this));
      return {
          _id,
          username,
          email,
      };
  }
  
}

const UserModel = getModelForClass(User);
export default UserModel;
export { User };
