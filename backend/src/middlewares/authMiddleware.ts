// import { Request, Response, NextFunction } from "express";
// import jwt from "jsonwebtoken";
// import dotenv from "dotenv";

// dotenv.config();

// export interface AuthRequest extends Request {
//   user?: { userId: number };
// }

// export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
//   const token = req.header("Authorization")?.split(" ")[1];

//   if (!token) {
//     return res.status(401).json({ message: "Unauthorized" });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: number };
//     req.user = { userId: decoded.userId };
//     next();
//   } catch (error) {
//     return res.status(403).json({ message: "Invalid token" });
//   }
// };


import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export interface AuthRequest extends Request {
  user?: { userId: number };
}

// ✅ Explicitly return void
export const authenticate = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "Unauthorized" }); // ✅ Return Response
    return; // ✅ Ensure function exits
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: number };
    req.user = { userId: decoded.userId };
    return next(); // ✅ Explicitly return `void`
  } catch (error) {
    res.status(403).json({ message: "Invalid token" }); // ✅ Return Response
    return; // ✅ Ensure function exits
  }
};
