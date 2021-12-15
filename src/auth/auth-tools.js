import jwt from "jsonwebtoken";

export const JWTauth = async (user) => {
  // 1. given the user generates token
  const accessToken = await generateJWTToken({ _id: user._id });
  return accessToken;
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
      { expiresIn: "1w" },
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