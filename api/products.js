import express from "express";
const router = express();
export default router;

import getUserFromToken from "#middleware/getUserFromToken";
import requireUser from "#middleware/requireUser";

router.get("/", async (req, res) => {
  const products;
  res.send("get /products test");
});

router.param("id", async (req, res, next) => {
  const product;

  if (!product) return res.status(404).send("product not found");

  req.product = product;
  next();
});

router.get("/:id", async (req, res) => {
  res.send(req.product);
});

router.get("/:id/orders", getUserFromToken, requireUser, async (req, res) => {
  const orders;
  res.send("get /products/:id/orders test");
});
