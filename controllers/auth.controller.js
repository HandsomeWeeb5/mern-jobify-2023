import { StatusCodes } from "http-status-codes";
import User from '../models/user.model.js';
// import bcrypt from 'bcryptjs';
import { comparePassword, hashPassword } from "../utils/passwordUtils.js";
import { UnauthenticatedError } from "../errors/customError.js";
import { createJWT } from "../utils/tokenUtils.js";

export const register = async (req, res) => {
  const isFirstAccount = (await User.countDocuments()) === 0;
  req.body.role = isFirstAccount ? 'admin' : 'user';

  const hashedPassword = await hashPassword(req.body.password);
  req.body.password = hashedPassword;  

  const user = await User.create(req.body);
  res.status(StatusCodes.CREATED).json({ msg: 'User created' });
};

export const login = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  /**
   * * One liner with short-circuit evaluation
   * const isValidUser = user && await comparePassword(req.body.password, user.password);
   * 
   */
  console.log(user);
  if (!user) throw new UnauthenticatedError('Invalid Credential');
  const isPasswordCorrect = await comparePassword(req.body.password, user.password);
  if (!isPasswordCorrect) throw new UnauthenticatedError("Wrong Password");

  const token = createJWT({ userId: user._id, role: user.role });
  const oneDay = 1000 * 60 * 60 * 24;

  res.cookie('token', token, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    secure: process.env.NODE_ENV === 'production'
  });

  res.status(StatusCodes.ACCEPTED).json({ msg: 'login success' });
};

export const logout = async (req, res) => {
  res.cookie('token', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now())
  });
  res.status(StatusCodes.OK).json({ msg: 'user logged out!' });
}

