const router = require("express").Router();
const Cart = require("../model/Cart");
const { verifyTokenandAuthorization, verifyTokenandAdmin, verifyToken } = require("../middleware/verifyToken");


//Create Cart
router.post("/", verifyToken, async(req, res) => {
    const cart = new Cart(req.body);

    try {
        const newCart = await cart.save();
        res.status(200).json(newCart)
    } catch (error) {
        res.status(500).json(error)   
    }
})

//Update Cart
router.put("/:id", verifyTokenandAuthorization, async(req, res) => {
    try {
        const updateCart = await Cart.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, {new: true});

        res.status(200).json(updateCart);
    } catch (error) {
        res.status(500).json(error)
    };
});


//Delete Cart
router.put("/:id", verifyTokenandAuthorization, async(req, res) => {
    try {
        const deleteCart = await Cart.findByIdAndDelete(req.params.id);
        res.status(200).json(deleteCart);
    } catch (error) {
        res.status(500).json(error)
    };
});

//Get User Cart
router.get("/find/:userId", verifyTokenandAuthorization, async(req, res) => {
    try{
        const cart = await Cart.findOne({
            userId: req.params.userId
        });
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json(error)
    };
});

//Get All Cart
router.get("/", verifyTokenandAdmin, async(req, res) => {
    try {
        const carts = await Cart.find();
        res.status(200).json(carts);
    } catch (error) {
        res.status(500).json(error)
    };
});

module.exports = router;