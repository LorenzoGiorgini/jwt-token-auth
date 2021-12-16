import express from "express";
import UsersModel from "../../db/modals/usersModal/users.js";
import { JWTAuthMiddleware } from "../../auth/auth-user.js";
import { JWTauth, verifyRefreshToken } from "../../auth/auth-tools.js";
import passport from "passport";

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
      const _obj = {
        name: req.body.name,
        surname: req.body.surname,
        email: req.body.email,
        password: req.body.password,
      };

      const user = await req.user.update(_obj);

      await req.user.save();

      res.status(203).send({ success: true, data: user });
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

router.route("/login").post(async (req, res) => {
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
    const createUser = new UsersModel(req.body);

    if (createUser) {
      await createUser.save();

      const { accessToken, refreshToken } = await JWTauth(createUser);

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production" ? true : false,
        sameSite: "lax",
      });
  
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production" ? true : false,
        sameSite: "lax",
      });

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
});

router.route("/refreshToken").post(async (req, res) => {
  try {
    const { currentRefreshToken } = req.body;

    const { accessToken, refreshToken } = await verifyRefreshToken(
      currentRefreshToken
    );

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" ? true : false,
      sameSite: "lax",
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" ? true : false,
      sameSite: "lax",
    });
  } catch (error) {
    res.status(404).send({ success: false, error: error.message });
  }
});

router
  .route("/googleLogin")
  .get(passport.authenticate("google", { scope: ["profile", "email"] }));

router
  .route("/googleRedirect")
  .get(passport.authenticate("google"), async (req, res) => {
    try {
      console.log(req.user)
      console.log("here")
      res.cookie("accessToken", req.user.tokens.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production" ? true : false,
        sameSite: "lax",
      });

      res.cookie("refreshToken", req.user.tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production" ? true : false,
        sameSite: "lax",
      });

      res.redirect(`${process.env.FE_URL}`);
    } catch (error) {
      res.status(404).send({ success: false, error: error.message });
    }
  });

export default router;