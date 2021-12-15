import express from "express";
import UsersModel from "../../db/modals/usersModal/users.js";
import { authMiddleware } from "../../auth/user.js";

const { Router } = express;

const router = Router();

router
  .route("/")
  .post(async (req, res, next) => {
    try {
      const createUser = new UsersModel(req.body);

      if (createUser) {
        await createUser.save();

        res.status(201).send({ success: true, user: createUser._id });
      } else {
        res.status(400).send({
          success: false,
          message: "Something Went Wrong in the creation of the user",
        });
      }
    } catch (error) {
      res.status(400).send({ success: false, error: error.message });
    }
  })
  .get(authMiddleware , async (req, res) => {
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
  .get(authMiddleware, async (req, res) => {
    try {
      res.status(200).send({ success: true, data: req.user });
    } catch (error) {
      res.status(404).send({ success: false, error: error.message });
    }
  })
  .put(authMiddleware, async (req, res) => {
    try {
      
      
    } catch (error) {
      res.status(404).send({ success: false, error: error.message });
    }
  })
  .delete(authMiddleware, async (req, res) => {
    try {
      await req.user.deleteOne()
      res.status(204).send({ success: true, message: "User Deleted" });
    } catch (error) {
      res.status(404).send({ success: false, error: error.message });
    }
  });



export default router;