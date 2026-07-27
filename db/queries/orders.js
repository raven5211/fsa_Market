import db from "#db/client";

export async function createOrder({ date, note, user_id }) {
  const sql = `
    INSERT INTO orders
      (date, note, user_id)
    VALUES
      ($1, $2, $3)
    RETURNING *
  `;
  const {
    rows: [order],
  } = await db.query(sql, [date, note, user_id]);
  return order;
}

export async function getOrderById(id) {
  const sql = `
    SELECT *
    FROM orders
    WHERE id = $1
  `;
  const {
    rows: [order],
  } = await db.query(sql, [id]);
  return order;
}

export async function getOrdersByUserId(user_id) {
  const sql = `
    SELECT *
    FROM orders
    WHERE user_id = $1
  `;
  const { rows: orders } = await db.query(sql, [user_id]);
  return orders;
}

export async function getOrdersByProductId(product_id) {
  const sql = `
    SELECT orders.*
    FROM
      orders_products
      JOIN orders ON orders_products.order_id = orders.id
      JOIN products ON orders_products.product_id = products.id
    WHERE
      products.id = $1
  `;
  const { rows: orders } = await db.query(sql, [product_id]);
  return orders;
}
