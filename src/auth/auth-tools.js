import jwt from "jsonwebtoken";
import UsersSchema from "../db/modals/usersModal/users.js";

export const JWTauth = async (user) => {
  // 1. given the user generates token
  const accessToken = await generateJWTToken({ _id: user._id });
  const refreshToken = await generateRefreshJWTToken({ _id: user._id });

  user.refreshToken = refreshToken;

  await user.save();

  return { accessToken, refreshToken };
};

const generateJWTToken = (payload) =>
  new Promise((resolve, reject) =>
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "15m" },
      (err, token) => {
        if (err) reject(err);
        else resolve(token);
      }
    )
  );

const generateRefreshJWTToken = (payload) =>
  new Promise((resolve, reject) =>
    jwt.sign(
      payload,
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "1 week" },
      (err, token) => {
        if (err) reject(err);
        else resolve(token);
      }
    )
  );

export const verifyNormalJWT = (token) =>
  new Promise((resolve, reject) =>
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if (err) reject(err);
      else resolve(decodedToken);
    })
  );

export const verifyRefreshJWT = (token) =>
  new Promise((resolve, reject) =>
    jwt.verify(token, process.env.JWT_REFRESH_SECRET, (err, decodedToken) => {
      if (err) reject(err);
      else resolve(decodedToken);
    })
  );

export const verifyRefreshToken = async (currentRefreshToken) => {

  const decodedRefreshToken = await verifyRefreshJWT(currentRefreshToken);

  const user = await UsersSchema.findById(decodedRefreshToken._id);

  if (!user) throw new Error("User not found!");

  if (user.refreshToken && user.refreshToken === currentRefreshToken) {
    const { accessToken, refreshToken } = await JWTauth(user);

    return { accessToken, refreshToken };
  } else {
    throw new Error("Token not valid!");
  }
};