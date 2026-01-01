import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User, { UserRole } from '../models/User';
import { verifyGoogleToken } from '../utils/googleAuth';

export const googleSignup = async (req: Request, res: Response) => {
  try {
    const { idToken, role } = req.body as {
      idToken?: string;
      role?: UserRole;
    };

    // Validation
    if (!idToken || !role) {
      return res.status(400).json({
        message: 'idToken and role are required',
      });
    }

    if (!['ADMIN', 'ANALYST'].includes(role)) {
      return res.status(400).json({
        message: 'Invalid role',
      });
    }

    // Verify Google token
    const googleUser = await verifyGoogleToken(idToken);

    // Check if user already exists
    const existingUser = await User.findOne({
      email: googleUser.email,
    });

    if (existingUser) {
      return res.status(409).json({
        message: `Already registered as ${existingUser.role}`,
      });
    }

    // Create user
    const user = await User.create({
      email: googleUser.email,
      name: googleUser.name,
      avatar: googleUser.avatar,
      role,
      authProvider: 'GOOGLE',
    });

    // Issue JWT
    const token = jwt.sign(
      {
        userId: user._id.toString(),
        role: user.role,
      },
      process.env.JWT_SECRET as string,
      { expiresIn: '7d' }
    );

    return res.status(201).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (err) {
    console.error('Google Signup Error:', err);
    return res.status(401).json({
      message: 'Google signup failed',
    });
  }
};
export const googleLogin = async (req: Request, res: Response) => {
  try {
    const { idToken, role } = req.body as {
      idToken?: string;
      role?: UserRole;
    };

    // Validation
    if (!idToken || !role) {
      return res.status(400).json({
        message: 'idToken and role are required',
      });
    }

    if (!['ADMIN', 'ANALYST'].includes(role)) {
      return res.status(400).json({
        message: 'Invalid role',
      });
    }

    // Verify Google token
    const googleUser = await verifyGoogleToken(idToken);

    // Find user
    const user = await User.findOne({
      email: googleUser.email,
    });

    if (!user) {
      return res.status(404).json({
        message: 'User not registered. Please sign up first.',
      });
    }

    // Role mismatch
    if (user.role !== role) {
      return res.status(403).json({
        message: `This account is registered as ${user.role}`,
      });
    }

    // Issue JWT
    const token = jwt.sign(
      {
        userId: user._id.toString(),
        role: user.role,
      },
      process.env.JWT_SECRET as string,
      { expiresIn: '7d' }
    );

    return res.status(200).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (err) {
    console.error('Google Login Error:', err);
    return res.status(401).json({
      message: 'Google login failed',
    });
  }
};
