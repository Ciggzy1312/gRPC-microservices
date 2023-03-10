const express = require("express");
const app = express();
const userRouter = require("./routes/user");
const postRouter = require("./routes/post");
const commentRouter = require("./routes/comment");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/user", userRouter);
app.use("/post", postRouter);
app.use("/comment", commentRouter);

app.listen(5000, () => {
    console.log("Listening on port 5000");
});