const express = require("express"),
    createHttpError = require("http-errors"),
    router = express.Router();

const Product = require("./model");
const Review = require("../reviews/model");

router.get("/", async (req, res, next) => {
    //get all products with pagination
    const query = {};
    if (req.query.category) {
        query.category = req.query.category;
    }
    if (req.query.price) {
        query.price = { $lt: req.query.price };
    }
    try {
        const { page, limit } = req.query;

        const products = await Product.find(query)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();

        const count = await Product.countDocuments();

        res.json({
            products,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
        });
    } catch (err) {
        next(err);
    }
});

router.get("/:id", async (req, res, next) => {
    //get single product
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            res.json(product);
        } else {
            next(createHttpError(404, "Product not found"));
        }
    } catch (err) {
        next(err);
    }
});

router.post("/", async (req, res, next) => {
    //create new product
    try {
        const newProduct = new Product(req.body);
        const { _id } = await newProduct.save();
        res.status(201).json(_id);
    } catch (err) {
        next(err);
    }
});

router.put("/:id", async (req, res, next) => {
    //update product
    try {
        const data = req.body;
        const product = await Product.findByIdAndUpdate(req.params.id, {
            $set: data,
        });

        if (product) {
            res.json(product);
        } else {
            next(createHttpError(404, "Product not found"));
        }
    } catch (err) {
        next(err);
    }
});

router.delete("/:id", async (req, res, next) => {
    //delete product
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (product) {
            res.json(product);
        } else {
            next(createHttpError(404, "Product not found"));
        }
    } catch (err) {
        next(err);
    }
});

module.exports = router;
