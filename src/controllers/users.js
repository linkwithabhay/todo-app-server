import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

import User from "../models/User.js";

export const signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (!existingUser)
      return res.status(404).json({
        message: "Invalid credentials",
        type: "invalid",
        severity: "error",
      });

    const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordCorrect) return res.status(400).json({ message: "Invalid credentials", type: "invalid", severity: "error" });

    const token = jwt.sign(
      { email: existingUser.email, id: existingUser._id },
      process.env.JWT_ADMIN_ACCESS_TOKEN_SECRET
      // , { expiresIn: "1h" }
    );
    // TODO: LIMIT THE RESULT SO THAT SENSITIVE INFORMATION IS NOT FORWARDED
    const user = {
      name: existingUser?.name,
      email: existingUser?.email,
      _id: existingUser?._id,
    };

    res.status(200).json({ result: user, token });
  } catch (error) {
    res.status(500).json({ message: "Server Error", type: "server", severity: "error" });
  }
};

export const signup = async (req, res) => {
  const { email, password, confirmPassword, firstName, lastName } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser)
    return res.status(400).json({
      message: `${email} already exists.`,
      type: "emailExists",
      severity: "error",
    });

  if (password !== confirmPassword)
    return res.status(400).json({ message: "Confirm Password does not match", type: "confirmPassword", severity: "error" });

  const hashedPassword = await bcrypt.hash(password, 12);

  const result = await User.create({
    email,
    password: hashedPassword,
    name: `${firstName} ${lastName}`,
  });

  const token = jwt.sign(
    { email: result.email, id: result._id },
    process.env.JWT_ADMIN_ACCESS_TOKEN_SECRET
    // , { expiresIn: "1h" }
  );

  // TODO: LIMIT THE RESULT SO THAT SENSITIVE INFORMATION IS NOT FORWARDED
  const user = {
    name: result?.name,
    email: result?.email,
    _id: result?._id,
  };

  res.status(200).json({ result: user, token });

  try {
  } catch (error) {
    res.status(500).json({ message: "Server Error.", type: "server", severity: "error" });
  }
};

export const revalidate = async (req, res) => {
  const { password } = req.body;

  try {
    if (!req?.userId) return res.status(401).json({ message: "Unauthenticated User", type: "invalid_user", severity: "error" });

    if (!mongoose.Types.ObjectId.isValid(req.userId))
      return res.status(404).json({ message: "User Not Found.", type: "invalid_user", severity: "error" });

    const existingUser = await User.findById(req.userId);
    if (!existingUser)
      return res.status(404).json({
        message: "Invalid credentials",
        type: "invalid",
        severity: "error",
      });

    const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordCorrect) return res.status(400).json({ message: "Invalid credentials", type: "invalid", severity: "error" });

    let token;
    if (req?.email) {
      token = jwt.sign(
        { email: req.email, id: req.userId },
        process.env.JWT_ADMIN_ACCESS_TOKEN_SECRET
        // , { expiresIn: "1h" }
      );
    }

    res.status(200).json({ token, message: "Authentication Successfull.", authenticated: true, type: "valid_auth", severity: "success" });
  } catch (error) {
    res.status(500).json({ message: error.message, type: "server", severity: "error" });
  }
};

export const updateuser = async (req, res) => {
  const { fullName } = req.body;
  try {
    if (!req.email) return res.status(404).json({ message: "Feature not applicable for you.", type: "invalid_homie", severity: "warning" });
    if (!mongoose.Types.ObjectId.isValid(req.userId))
      return res.status(404).json({ message: "User Not Found.", type: "invalid_user", severity: "error" });
    const user = await User.findById(req?.userId);
    user.name = fullName;

    const updatedUser = await User.findByIdAndUpdate(req.userId, user, { new: true });
    res.status(200).json({ result: updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Server Error", type: "server", severity: "error" });
  }
};
