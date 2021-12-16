import { verifyNormalJWT } from "./auth-tools.js";
import UsersSchema from "../db/modals/usersModal/users.js";

export const JWTAuthMiddleware = async (req, res, next) => {
  if (!req.cookies.accessToken) {
    res.status(401).send({ success: false, message: "Please provide token in Authorization header!"});
  } else {
    try {
      const token = req.cookies.accessToken

      const decodedToken = await verifyNormalJWT(token);

      const user = await UsersSchema.findById(decodedToken._id);

      if (user) {
        req.user = user;
        
        next();

      } else {
        res.status(404).send({ success: false, message: "User not found" });

      }
    } catch (error) {
      res.status(401).send({ success: false, message: "Not authorized" });

    }
  }
};