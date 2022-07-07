import * as bcrypt from 'bcrypt';

export default class PasswordUtil {
  public static async encryptPassword(password: string) {
    const salt = await bcrypt.genSalt();

    return bcrypt.hash(password, salt);
  }
}
