import db from "#db/client";
import { faker } from "@faker-js/faker";
import { verifyToken } from "#utils/jwt";

import { createUser } from "./queries/users.js";
import { createProduct } from "./queries/products.js";
import { createOrder } from "./queries/orders.js";
import { createOrderProduct } from "./queries/orders_products.js";

await db.connect();
await seed();
await db.end();
console.log("🌱 Database seeded.");

async function seed() {
  // create 1 user
  const token = await createUser({
    username: faker.internet.username(),
    password: faker.internet.password(),
  });

  const { id: user_id } = verifyToken(token);

  // create 10 products
  const products = [];
  for (let i = 0; i < 10; i++) {
    const newProduct = await createProduct({
      title: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: faker.commerce.price({ min: 10, max: 250 }),
    });
    products.push(newProduct);
  }

  // create 1 order
  const orders = [];
  orders[0] = await createOrder({
    date: faker.date.past({ years: 1 }),
    note: faker.datatype.boolean()
      ? faker.lorem.sentence({ min: 1, max: 3 })
      : null,
    user_id: user_id,
  });
  const order = orders[0];

  //add 5 unique products to the created order
  const orderProducts = [];
  for (let i = 0; i < 5; i++) {
    let foundUnique = false;
    do {
      const randomProduct =
        products[Math.floor(Math.random() * products.length)];
      const productInOrderProducts = orderProducts.find(
        (orderProduct) =>
          orderProduct.order_id == order.id &&
          orderProduct.product_id == randomProduct.id,
      );
      foundUnique = !productInOrderProducts;

      if (foundUnique) {
        const newOrderProduct = await createOrderProduct({
          order_id: order.id,
          product_id: randomProduct.id,
          quantity: Math.round(Math.random() * 5),
        });
        orderProducts.push(newOrderProduct);
      }

      //escape condition if no more unique order-product pairings are possible
      if (orderProducts.length >= orders.length * products.length) return;
    } while (!foundUnique);
  }
}
