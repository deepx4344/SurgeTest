import bcrypt from "bcrypt";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";

import { createServiceError } from "../utils/index.js";
import processConfig from "../config/env.js";
import Users from "../models/users.js";
import { JWTPayload, ServiceError } from "../types/index.js";
import { verificationEmail } from "../utils/email.js";
import logger from "../middlewares/logger.js";
import { generateToken, verifyToken } from "../utils/jwt.js";
class AuthService {
  private readonly authSecret: string = processConfig.JWTs.secret!;
  private readonly authSecretDuration: string = processConfig.JWTs.duration!;
  private readonly emailVerificationKey: string =
    processConfig.JWTs.verifyEmail.key!;
  private readonly emailVerificationDuration: string =
    processConfig.JWTs.verifyEmail.duration!;
  private readonly bcryptSaltRounds: number = Number(
    processConfig.bcryptRounds
  );

  register = async (email: string, password: string): Promise<void> => {
    try {
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

      let dUser;
      try {
        dUser = await newUser.save();
      } catch (saveErr: unknown) {
        if (
          saveErr &&
          typeof saveErr === "object" &&
          (saveErr as any).code === 11000
        ) {
          throw createServiceError("User already Exists", 409);
        }
        logger.error("DB save error during registration", { error: saveErr });
        throw createServiceError("Failed to create user", 500);
      }

      const payLoad: JWTPayload = {
        userReg: true,
        email: dUser.email as string,
      };

      try {
        await verificationEmail(
          dUser.email as string,
          payLoad,
          this.emailVerificationKey,
          this.emailVerificationDuration
        );
      } catch (emailErr: unknown) {
        logger.error("Verification email failed", { error: emailErr });
        throw createServiceError("Verification email failed", 502);
      }
    } catch (e: unknown) {
      if (e instanceof ServiceError) throw e;
      logger.error("Unexpected error in register", { error: e });
      throw createServiceError("Registration failed", 500);
    }
  };
  login = async (email: string, password: string): Promise<string> => {
    const user = await Users.findOne({ email: email.trim() });
    if (!user) {
      throw createServiceError("Invalid Credentials", 401);
    }
    const passwordCheck = await bcrypt.compare(
      password,
      user.password as string
    );
    if (!passwordCheck) {
      throw createServiceError("Invalid Credentials", 401);
    }
    if (!user.verified) {
      throw createServiceError("Please verify before logging in", 403);
    }
    const payload: JWTPayload = {
      userReg: true,
      email: user.email as string,
      id: user.id,
    };
    let token: string;
    try {
      token = await generateToken(
        payload,
        this.authSecret,
        this.authSecretDuration
      );
    } catch (err: unknown) {
      if (err instanceof TokenExpiredError) {
        logger.error(`Token expired at: ${err.expiredAt}`);
        throw createServiceError("Token has expired", 401);
      } else if (err instanceof JsonWebTokenError) {
        logger.error(`Invalid Token ${err.message}`);
        throw createServiceError("Invalid Token", 401);
      } else {
        logger.error("Error generating token", { error: err });
        throw createServiceError("Could not generate token", 500);
      }
    }
    return token;
  };
  verify = async (token: string): Promise<void> => {
    const result: JWTPayload = (await verifyToken(
      token,
      this.emailVerificationKey
    )) as JWTPayload;
    await Users.findOneAndUpdate({ email: result.email }, { verified: true });
  };
}

export default AuthService;
