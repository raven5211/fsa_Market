import express from "express";
const router = express();
export default router;

import getUserFromToken from "#middleware/getUserFromToken";
import requireUser from "#middleware/requireUser";

import { getProductById, getProducts } from "#db/queries/products";
import { getOrdersByProductId } from "#db/queries/orders";

router.get("/", async (req, res) => {
  const products = await getProducts();
  res.send(products);
});

router.param("id", async (req, res, next) => {
  const product = await getProductById(req.params.id);

  if (!product) return res.status(404).send("product not found");

  req.product = product;
  next();
});

router.get("/:id", async (req, res) => {
  res.send(req.product);
});

router.get("/:id/orders", getUserFromToken, requireUser, async (req, res) => {
  const orders = await getOrdersByProductId(req.product.id);
  res.send(orders);
});
