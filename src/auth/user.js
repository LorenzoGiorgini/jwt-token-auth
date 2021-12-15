import UsersModel from "../db/modals/usersModal/users.js"

export const authMiddleware = async (req, res, next) => {
  if (!req.headers.authorization) {
    res.status(401).send({ status: "401", message: "Unauthorized" });

  } else {
    const base64Credentials = req.headers.authorization.split(" ")[1];

    const buffer = Buffer.from(base64Credentials, "base64");

    const decodedCredentials = buffer.toString();
    
    const [email, password] = decodedCredentials.split(":");

    const user = await UsersModel.checkCredentials(email, password);

    if (user) {
      req.user = user;

      next();
    } else {
      res.status(401).send({ sucess: false, message: "Credentials are wrong" });

    }
  }
};