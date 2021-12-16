import express from 'express';
import mongoose from 'mongoose';
import cors from "cors"
import passport from 'passport';
import listEndpoints from "express-list-endpoints"
import cookieParser from 'cookie-parser';


//routes
import BlogsRouter from "./services/blogs/blog-posts.js"
import UsersRouter from "./services/users/users.js"

//google oauth
import googleStrategy from "./auth/oauth-google.js"


const server = express();


passport.use("google", googleStrategy)

server.use(cors())
server.use(cookieParser())
server.use(express.json());
server.use(passport.initialize());
server.use("/blogPosts", BlogsRouter)
server.use("/users", UsersRouter)



const port = process.env.PORT;

mongoose.connect(process.env.MONGO_CONNECTION)


mongoose.connection.on('connected', () => {
    server.listen(port, () => {
        console.table(listEndpoints(server));
    })
})