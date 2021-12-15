import express from 'express';
import mongoose from 'mongoose';
import listEndpoints from "express-list-endpoints"

import BlogsRouter from "./services/blogs/blog-posts.js"
import UsersRouter from "./services/users/users.js"


const server = express();


server.use(express.json());


server.use("/blogPosts", BlogsRouter)
server.use("/users", UsersRouter)



const port = process.env.PORT;

mongoose.connect(process.env.MONGO_CONNECTION)


mongoose.connection.on('connected', () => {
    server.listen(port, () => {
        console.table(listEndpoints(server));
    })
})