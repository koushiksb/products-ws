const express = require("express");
const router = new express.Router();

const { getProducts } = require("../controller/products.controller");



router.get("/", getProducts);

module.exports = router;