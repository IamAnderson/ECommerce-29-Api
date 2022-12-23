const router = require("express").Router();
const Order = require("../model/Order");
const { verifyTokenandAuthorization, verifyTokenandAdmin, verifyToken } = require("../middleware/verifyToken");


//Create Orders
router.post("/", verifyToken, async(req, res) => {
    const order = new Order(req.body);

    try {
        const newOrder = await order.save();
        res.status(200).json(newOrder)
    } catch (error) {
        res.status(500).json(error)   
    }
})

//Update Orders
router.put("/:id", verifyTokenandAdmin, async(req, res) => {
    try {
        const updateCart = await Order.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, {new: true});

        res.status(200).json(updateCart);
    } catch (error) {
        res.status(500).json(error)
    };
});


//Delete Orders
router.put("/:id", verifyTokenandAdmin, async(req, res) => {
    try {
        const deleteCart = await Order.findByIdAndDelete(req.params.id);
        res.status(200).json(deleteCart);
    } catch (error) {
        res.status(500).json(error)
    };
});

//Get User Orders
router.get("/:userId", verifyTokenandAuthorization, async(req, res) => {
    try {
        const orders = await Order.find({
            userId: req.params.userId
        });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json(error)
    };
});

//Get All Orders
router.get("/", verifyTokenandAdmin, async(req, res) => {
    try {
        const orders = await Order.find();
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json(error)
    };
});

//Get Monthly Income

router.get("/income", verifyTokenandAdmin, async (req, res) => {
    const date = new Date();
    const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
    const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));
  
    try {
      const income = await Order.aggregate([
        { $match: { createdAt: { $gte: previousMonth } } },
        {
          $project: {
            month: { $month: "$createdAt" },
            sales: "$amount",
          },
        },
        {
          $group: {
            _id: "$month",
            total: { $sum: "$sales" },
          },
        },
      ]);
      res.status(200).json(income);
    } catch (err) {
      res.status(500).json(err);
    }
  });

// router.get("/income", verifyTokenandAdmin, async(req, res) => {
//     const date = new Date();
//     const lastMonth = new Date(date.setMonth(date.getMonth()-1));
//     const prevMonth = new Date(new Date().setMonth(lastMonth.getMonth()-1));
//     try {
//         const income = await Order.aggregate([
//             {$match: { createdAt: { $gte: prevMonth } }},
//             {
//                 $project: {
//                     month: { $month: "$createddAt" },
//                     sales: "$amount"
//                 },

//                 $group: {
//                     _id: "$month",
//                     total: { $sum: "$sales" },
//                 }
//             }
//         ])
//         res.status(200).json(income)
//     } catch (error) {
//         res.status(500).json(error)
//     }
// })

module.exports = router;