import { getModelForClass, prop, pre} from '@typegoose/typegoose';
import bcrypt from 'bcrypt';

@pre<User>('save', async function() {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
})
class User {
  @prop({ required: true })
  public username! : string;
  @prop({ required: true })
  public email! : string;
  @prop({ required: true })
  public password! : string;

  public async setPassword(password: string) {
    this.password = await bcrypt.hash(password, 10);
  }

  public async checkPassword(password: string) {
    return await bcrypt.compare(password, this.password);
  }
}

const UserModel = getModelForClass(User);
export default UserModel;