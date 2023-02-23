const express = require("express"),
    router = express.Router();

const Review = require("./model");
const Product = require("../products/model");

router.get("/:pid", async (req, res, next) => {
    //get reviews for product

    try {
        const product = await Product.findById(req.params.pid).populate(
            "review"
        );

        if (product) {
            const reviews = product.reviews;
            res.json(reviews);
        } else {
            next(createHttpError(404, "Product not found"));
        }
    } catch (e) {
        next(err);
    }
});

router.post("/:pid", async (req, res, next) => {
    //create new review for product
    try {
        const newReview = new Review(req.body);
        const { _id } = await newReview.save();

        const product = await Product.findById(req.params.pid);
        product.reviews.push(_id);
        await product.save();
    } catch (err) {
        next(err);
    }
});

router.delete("/:pid/:rid", async (req, res, next) => {
    //delete review for product
    try {
        const product = await Product.findById(req.params.pid);
        const review = await Review.findById(req.params.rid);

        if (product && review) {
            product.reviews = product.reviews.filter(
                (r) => r.toString() !== req.params.rid
            );
            await product.save();
            await review.deleteOne();
            res.status(204).send();
        } else {
            next(createHttpError(404, "Product or Review not found"));
        }
    } catch (err) {
        next(err);
    }
});

router.put("/:pid/:rid", async (req, res, next) => {
    //update review for product
    try {
        const data = req.body;
        const review = await Review.findByIdAndUpdate(req.params.rid, {
            $set: data,
        });

        if (review) {
            res.json(review);
        } else {
            next(createHttpError(404, "Review not found"));
        }
    } catch (err) {
        next(err);
    }
});

module.exports = router;
