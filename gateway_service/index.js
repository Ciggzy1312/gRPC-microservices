const express = require("express");
const app = express();
const userRouter = require("./routes/user");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/user", userRouter);

app.listen(5000, () => {
    console.log("Listening on port 5000");
});