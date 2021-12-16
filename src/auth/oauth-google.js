import GoogleStrategy from "passport-google-oauth20";
import UsersSchema from "../db/modals/usersModal/users.js";
import { JWTauth } from "./auth-tools.js";
import passport from "passport"

const googleStrategy = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_OAUTH_ID,
    clientSecret: process.env.GOOGLE_OAUTH_SECRET,
    callbackURL: `${process.env.API_URL}/users/googleCallback`,
  },
  async (accessToken, refreshToken, profile, passportNext) => {
    try {
      const user = await UsersSchema.findOne({ googleId: profile.id });

      if (user) {
        const tokens = await JWTauth(user);

        passportNext(null, { tokens });
      } else {
        const newUser = new UsersSchema({
          name: profile.name.givenName,
          surname: profile.name.familyName,
          email: profile.emails[0].value,
          googleId: profile.id,
        });

        const tokens = await JWTauth(newUser);

        passportNext(null, { tokens });
      }
    } catch (error) {
      passportNext(error);
    }
  }
);

passport.serializeUser(function (data, passportNext) {
  passportNext(null, data);
});


export default googleStrategy