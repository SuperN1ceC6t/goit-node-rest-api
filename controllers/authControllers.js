import path from "path";
import Jimp from "jimp";
import gravatar from "gravatar";
import fs from "fs/promises";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import authServices from "../services/authServices.js";
import ctrlWrapper from "../decorators/ctrlWrapper.js";
import HttpError from "../helpers/HttpError.js";
import dotenv from "dotenv";
import User from "../models/User.js";
import sendEmail from "../helpers/sendEmail.js";
import { v4 as uuidv4 } from "uuid";

dotenv.config();

const avatarPath = path.resolve("public", "avatars");

const { JWT_SECRET, PROJECT_URL } = process.env;

const signup = async (req, res) => {
  const { email, password } = req.body;
  const user = await authServices.findUser({ email });
  if (user) throw HttpError(409, "Email already in use");
  const hashPassword = await bcrypt.hash(password, 10);
  const verificationToken = uuidv4();
  const avatarURL = gravatar.url(email);
  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<a target="_blank" href="${PROJECT_URL}/api/users/verify/${verificationToken}">Click to verify email<a>`,
  };

  await sendEmail(verifyEmail);

  const newUser = await authServices.signup({
    ...req.body,
    password: hashPassword,
    avatarURL,
    verificationToken,
  });
  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
      avatarURL: newUser.avatarURL,
      verificationToken: newUser.verificationToken,
    },
  });
};

const verify = async (req, res) => {
  const { verificationToken } = req.params;
  const user = await authServices.findUser({ verificationToken });
  if (!user) throw HttpError(404, "User not found");
  await authServices.updateUser(
    { _id: user._id },
    { verify: true, verificationToken: null }
  );
  res.status(200).json({
    message: "Verification successful",
  });
};

const resendVerify = async (req, res) => {
  const { email } = req.body;
  const user = await authServices.findUser({ email });
  if (!user) {
    throw HttpError(404, "User not found");
  }
  if (user.verify) {
    throw HttpError(400, "Verification has already been passed");
  }
  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<a target="_blank" href="${PROJECT_URL}/api/users/verify/${user.verificationToken}">Click to verify email<a>`,
  };

  await sendEmail(verifyEmail);

  res.json({
    message: "Verify email send again",
  });
};

const signin = async (req, res) => {
  const { email, password } = req.body;
  const user = await authServices.findUser({ email });
  if (!user) throw HttpError(401, "Email or password is wrong");
  if (!user.verify) throw HttpError(401, "Email not verify");
  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) throw HttpError(401, "Email is not verifed");
  const { _id: id } = user;
  const payload = { id };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "12h" });
  await authServices.updateUser({ _id: id }, { token });
  res.json({
    token,
    user: {
      email: user.email,
      subscription: user.subscription,
      avatarURL: user.avatarURL,
    },
  });
};

const getCurrent = async (req, res) => {
  const { email, subscription, avatarURL } = req.user;
  res.json({ email, subscription, avatarURL });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await authServices.updateUser({ _id }, { token: null });
  res.status(204).send();
};

const updateAvatar = async (req, res) => {
  const { email } = req.user;
  if (!req.file) throw HttpError(400, "Not found");

  const { _id } = req.user;
  const { path: oldPath, originalname } = req.file;

  try {
    const image = await Jimp.read(oldPath);
    await image.resize(250, 250);
    await image.writeAsync(oldPath);
  } catch (error) {
    throw HttpError(500, "Internal Server Error");
  }
  const uniquePrefix = `${email}_${Date.now()}`;
  const filename = `${uniquePrefix}_${originalname}`;
  const resultUpload = path.join(avatarPath, filename);
  await fs.rename(oldPath, resultUpload);
  const avatarURL = path.join("avatars", filename);
  await User.findByIdAndUpdate(_id, { avatarURL });

  res.json({
    avatarURL,
  });
};

export default {
  signup: ctrlWrapper(signup),
  signin: ctrlWrapper(signin),
  getCurrent: ctrlWrapper(getCurrent),
  logout: ctrlWrapper(logout),
  updateAvatar: ctrlWrapper(updateAvatar),
  verify: ctrlWrapper(verify),
  resendVerify: ctrlWrapper(resendVerify),
};
