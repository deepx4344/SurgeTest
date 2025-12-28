import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { createServiceError } from "../utils/index.js";
import processConfig from "../config/env.js";
import Users from "../models/users.js";
import { JWTPayload } from "../types/index.js";
import { verificationEmail } from "../utils/email.js";
class AuthService {
  private readonly authSecret: string = processConfig.JWTs.secret!;
  private readonly authSecretDuration: string = processConfig.JWTs.secret!;
  private readonly emailVerificationKey: string =
    processConfig.JWTs.verifyEmail.key!;
  private readonly emailVerificationDuration: string =
    processConfig.JWTs.verifyEmail.duration!;
  private readonly bcryptSaltRounds: number = Number(
    processConfig.bcryptRounds
  );

  register = async (email: string, password: string): Promise<void> => {
    const userExists = await Users.findOne({ email: email.trim() });
    if (userExists) {
      throw createServiceError("User already Exists", 409);
    }
    const hashedPassword: string = await bcrypt.hash(
      password.trim(),
      this.bcryptSaltRounds
    );
    let newUser = new Users({
      email: email.trim(),
      password: hashedPassword,
      userReg: true,
    });
    let dUser = await newUser.save();
    const payLoad: JWTPayload = {
      userReg: true,
      email: dUser.email as string,
    };
    await verificationEmail(
      dUser.email as string,
      payLoad,
      this.emailVerificationKey,
      this.emailVerificationDuration
    );
  };
}

export default AuthService;
