import crypto from "crypto";
import jwt from "jsonwebtoken";
import { User } from "../types/index.js";
import asyncHandler from "../utils/async.js";
import processConfig from "../config/env.js";

// const authMiddleware = asyncHandler(async (req, res, next) => {
//   const signedCookiesToken: string = req.signedCookies["tokens"];
//   if (!signedCookiesToken) {

//     const token = jwt.sign()
//   } else {
//     const verified: User = jwt.verify(
//       signedCookiesToken,
//       processConfig.JWTs.secret!
//     ) as User;
//     req.user = verified;
//     next();
//   }
// });

// export default authMiddleware;
