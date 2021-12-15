import mongoose from "mongoose";
import bcrypt from "bcrypt";

const { Schema, model } = mongoose;

const UsersSchema = new Schema(
  {
    name: { type: String, required: true },
    surname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {type: String, default: 'user', enum: ['admin', 'user']}
  },
  {
    timestamps: true,
  }
);

UsersSchema.pre("save", async function (next) {
  const newUser = this;

  const password = newUser.password;

  if (newUser.isModified("password")) {
    const hash = await bcrypt.hash(password, 10);

    newUser.password = hash;
  }
  next();
});

// this function is called automatically by express EVERY TIME it does res.send()
UsersSchema.methods.toJSON = function () {
  const userDocument = this;

  const user = userDocument.toObject();

  delete user.password;

  delete user.__v;

  return user;
};

UsersSchema.statics.checkCredentials = async function (email, password) {

  const user = await this.findOne({ email });

  if (user) {
   
    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      return user;

    } else {
      return null;

    }
  } else {
    return null;

  }
};


export default model("User", UsersSchema);