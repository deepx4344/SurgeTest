import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const { JsonWebTokenError, TokenExpiredError } = jwt;

import { createServiceError } from "../utils/index.js";
import processConfig from "../config/env.js";
import Users from "../models/users.js";
import { JWTPayload, Tokens, User } from "../types/index.js";
import { verificationEmail } from "./emailService.js";
import logger from "../middlewares/logger.js";
import { generateToken, verifyToken } from "../utils/jwt.js";
import { addToBlackList } from "../utils/blackList.js";
import { ServiceError } from "../utils/errors.js";

class AuthService {
  private readonly authSecret: string = processConfig.JWTs.access.key!;
  private readonly authSecretDuration: string =
    processConfig.JWTs.access.duration!;
  private readonly refreshSecret: string = processConfig.JWTs.refresh.key!;
  private readonly refreshSecretDuration: string =
    processConfig.JWTs.refresh.duration!;
  private readonly emailVerificationKey: string =
    processConfig.JWTs.verifyEmail.key!;
  private readonly emailVerificationDuration: string =
    processConfig.JWTs.verifyEmail.duration!;
  private readonly bcryptSaltRounds: number = Number(
    processConfig.bcryptRounds,
  );

  register = async (email: string, password: string): Promise<void> => {
    try {
      const userExists = await Users.findOne({ email: email.trim() });
      if (userExists) {
        throw createServiceError("User already Exists", 409);
      }

      const hashedPassword: string = await bcrypt.hash(
        password.trim(),
        this.bcryptSaltRounds,
      );

      let newUser = new Users({
        email: email.trim(),
        password: hashedPassword,
      });

      const dUser = await newUser.save();

      const payLoad: JWTPayload = {
        email: dUser.email as string,
        id: dUser.id.toString(),
        paid: dUser.paid,
      };
      void verificationEmail(
        dUser.email as string,
        payLoad,
        this.emailVerificationKey,
        this.emailVerificationDuration,
      ).catch((err) => {
        logger.error(`Verification email failed for ${dUser.email}`, err);
      });
    } catch (e: unknown) {
      if (
        e &&
        typeof e === "object" &&
        "code" in e &&
        (e as any).code === 11000
      ) {
        throw createServiceError("User already exists", 409);
      }
      if (e instanceof ServiceError) throw e;
      logger.error("Unexpected error in register", e);
      throw createServiceError("Registration failed", 500);
    }
  };
  login = async (email: string, password: string): Promise<Tokens> => {
    const user = await Users.findOne({ email: email.trim() }).select(
      "+password",
    );
    if (!user) {
      throw createServiceError("Invalid Credentials", 401);
    }
    if (!user.verified) {
      throw createServiceError("Please verify before logging in", 403);
    }
    const passwordCheck = await bcrypt.compare(
      password,
      user.password as string,
    );
    if (!passwordCheck) {
      throw createServiceError("Invalid Credentials", 401);
    }
    const payload: JWTPayload = {
      email: user.email as string,
      id: user.id.toString(),
      paid: user.paid,
    };
    let assignment = [
      generateToken(payload, this.authSecret, this.authSecretDuration),
      generateToken(payload, this.refreshSecret, this.refreshSecretDuration),
    ];
    const processed = await Promise.all(assignment);
    const accessToken = processed[0];
    const refreshToken = processed[1];

    return { accessToken, refreshToken };
  };
  verify = async (token: string): Promise<void> => {
    const result: JWTPayload = (await verifyToken(
      token,
      this.emailVerificationKey,
    )) as JWTPayload;
    await Users.findOneAndUpdate({ email: result.email }, { verified: true });
  };
  refresh = async (token: string): Promise<string> => {
    const verified: JWTPayload = await verifyToken(token, this.refreshSecret);
    const newToken: string = await generateToken(
      verified,
      this.authSecret,
      this.authSecretDuration,
    );
    return newToken;
  };
  logout = async (token: string): Promise<void> => {
    await addToBlackList(token);
  };
  me = async(userId:string):Promise<User>=>{
    const user = await Users.findById(userId).lean()
    if(!user){
      throw createServiceError(`User with id of "${userId}" not found`,404)
    }
    return user;
  }
}

export default AuthService;
