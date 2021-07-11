import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/User.js";

export const signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (!existingUser)
      return res.status(404).json({
        message: `${email} doesn't exist in our database.`,
      });

    const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordCorrect) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { email: existingUser.email, id: existingUser._id },
      process.env.JWT_ADMIN_ACCESS_TOKEN_SECRET
      // , { expiresIn: "1h" }
    );
    res.status(200).json({ result: existingUser, token });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong." });
  }
};

export const signup = async (req, res) => {
  const { email, password, confirmPassword, firstName, lastName } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser)
    return res.status(400).json({
      message: `${email} already exist. Try to Sign In with this email.`,
    });

  if (password !== confirmPassword) return res.status(400).json({ message: "Password does not match" });

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

  res.status(200).json({ result, token });

  try {
  } catch (err) {
    res.status(500).json({ message: "Something went wrong." });
  }
};
