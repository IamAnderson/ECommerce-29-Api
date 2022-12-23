const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const authRouter = require("./route/auth");
const userRouter = require("./route/user");
const productRouter = require("./route/product");
const cartRouter = require("./route/cart");
const orderRouter = require("./route/order");
const paymentRouter = require("./route/stripe");

const bodyParser = require("body-parser");
const app = express();

app.use(cors());

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));

app.get("/", (req, res) => {
    res.json({message: "use the endpoints"})
})
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
app.use("/api/orders", orderRouter);
app.use("/api/checkout", paymentRouter);

mongoose.connect(process.env.MONGO_URI)
.then(() => {
    app.listen(process.env.PORT || 5000, () => {
        console.log(`DB connected and Server is running at: http://localhost:${process.env.PORT || 5000}/`)
    })
});
