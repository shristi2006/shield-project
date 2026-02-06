// src/controllers/googleAuth.controller.ts
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { verifyGoogleToken } from "../utils/googleAuth";

export const googleSignup = async (req: Request, res: Response) => {
  try {
    const { idToken, role } = req.body;

    if (!idToken || !role) {
      return res.status(400).json({ message: "idToken and role are required" });
    }

    const googleUser = await verifyGoogleToken(idToken);

    const existingUser = await User.findOne({ email: googleUser.email });
    if (existingUser) {
      return res.status(409).json({
        message: `Already registered as ${existingUser.role}`,
      });
    }

    const user = await User.create({
      email: googleUser.email,
      name: googleUser.name,
      avatar: googleUser.avatar,
      role,
      authProvider: "GOOGLE",
    });

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    return res.status(201).json({ token, user });
  } catch {
    return res.status(401).json({ message: "Google signup failed" });
  }
};

export const googleLogin = async (req: Request, res: Response) => {
  try {
    const { idToken } = req.body;
    if (!idToken) {
      return res.status(400).json({ message: "idToken is required" });
    }

    const googleUser = await verifyGoogleToken(idToken);
    const user = await User.findOne({ email: googleUser.email });

    if (!user) {
      return res.status(404).json({ message: "User not registered" });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    return res.status(200).json({ token, user });
  } catch {
    return res.status(401).json({ message: "Google login failed" });
  }
};
