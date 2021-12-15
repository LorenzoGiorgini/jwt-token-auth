import express from "express";
import UsersModel from "../../db/modals/usersModal/users.js";
import { JWTAuthMiddleware } from "../../auth/auth-user.js";
import { JWTauth } from "../../auth/auth-tools.js";

const { Router } = express;

const router = Router();

router.route("/").get(JWTAuthMiddleware, async (req, res) => {
  try {
    const allUsers = await UsersModel.find();

    if (allUsers) {
      res.status(200).send({ success: true, data: allUsers });
    } else {
      res.status(404).send({ success: false, message: "No Users Found" });
    }
  } catch (error) {
    res.status(400).send({ success: false, error: error.message });
  }
});

router
  .route("/me")
  .get(JWTAuthMiddleware, async (req, res) => {
    try {
      res.status(200).send({ success: true, data: req.user });
    } catch (error) {
      res.status(404).send({ success: false, error: error.message });
    }
  })
  .put(JWTAuthMiddleware, async (req, res) => {
    try {
    } catch (error) {
      res.status(404).send({ success: false, error: error.message });
    }
  })
  .delete(JWTAuthMiddleware, async (req, res) => {
    try {
      await req.user.deleteOne();
      res.status(204).send({ success: true, message: "User Deleted" });
    } catch (error) {
      res.status(404).send({ success: false, error: error.message });
    }
  });

router.route("/login").post(JWTAuthMiddleware, async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UsersModel.checkCredentials(email, password);

    if (user) {
      const token = await JWTauth(user);
      
      res.status(200).send({ success: true, token });
    } else {
      res
        .status(404)
        .send({ success: false, message: "Credentials are not correct" });
    }
  } catch (error) {
    req.status(404).send({ success: false, error: error.message });
  }
});

router.route("/register").post(async (req, res) => {
  try {
    console.log(req.body);
    const createUser = new UsersModel(req.body);
    if (createUser) {
      await createUser.save();

      const token = await JWTauth(createUser)

      res.status(201).send({ success: true, user: createUser._id, token });
    } else {
      res.status(400).send({
        success: false,
        message: "Something Went Wrong in the creation of the user",
      });
    }
  } catch (error) {
    res.status(400).send({ success: false, error: error.message });
  }
});



export default router;