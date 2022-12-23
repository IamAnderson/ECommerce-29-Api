const router = require("express").Router();
const Product = require("../model/Product");
const { verifyTokenandAuthorization } = require("../middleware/verifyToken");


//Create Product
router.post("/", verifyTokenandAuthorization, async(req, res) => {
    try {
        const product = new Product(req.body);
        const newProduct = await product.save();
        res.status(200).json(newProduct)
    } catch (error) {
        res.status(500).json(error);
    }
})

//Update Product
router.put("/:id", verifyTokenandAuthorization, async(req, res) => {
    try {
        const updateProduct = await Product.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, {new: true});

        res.status(200).json(updateProduct);
    } catch (error) {
        res.status(500).json(error)
    };
});


//Delete Product
router.delete("/:id", verifyTokenandAuthorization, async(req, res) => {
    try {
        const deleteProduct = await Product.findByIdAndDelete(req.params.id);
        res.status(200).json(deleteProduct);
    } catch (error) {
        res.status(500).json(error)
    };
});

//Get Product
router.get("/find/:id", async(req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json(error)
    };
});

//Get All Product without filter
router.get("/all", async(req, res) => {
  try {
      const product = await Product.find();
      res.status(200).json(product);
  } catch (error) {
      res.status(500).json(error)
  };
});

//Get All Products
router.get("/", async (req, res) => {
    const qNew = req.query.new;
    const qCategory = req.query.categories;
    try {
      let products;
  
      if (qNew) {
        products = await Product.find().sort({ createdAt: -1 }).limit(1);
      } else if (qCategory) {
        products = await Product.find({
          categories: {
            $in: [qCategory]
          },
        });
      } else {
        products = await Product.find();
      }
  
      res.status(200).json(products);
    } catch (err) {
      res.status(500).json(err);
    }
  });
  

module.exports = router;