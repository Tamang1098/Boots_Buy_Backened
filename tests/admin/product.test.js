const request = require("supertest");
const app = require("../../index");
const mongoose = require("mongoose");
const path = require("path");
const Brand = require("../../models/Brand");
const Product = require("../../models/Product");

let brandId;
let productId;

// 🟢 Suppress console.error before tests
beforeAll(async () => {
  jest.spyOn(console, "error").mockImplementation(() => {});

  await Brand.deleteMany({});
  await Product.deleteMany({});

  // Create a brand first
  const brandRes = await request(app)
    .post("/api/admin/brand")
    .field("brandname", "Test Brand")
    .attach("image", path.resolve(__dirname, "sample.png"));

  brandId = brandRes.body.data._id;
});

// 🟢 Restore console.error after all tests
afterAll(async () => {
  console.error.mockRestore();
  await mongoose.disconnect();
});

describe("Product API", () => {
  test("should fail to create product with missing fields", async () => {
    const res = await request(app)
      .post("/api/admin/product")
      .field("name", "Incomplete Product");
    expect(res.statusCode).toBe(403);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Missing field");
  });

  test("should fail to create product with invalid brandId", async () => {
    const res = await request(app)
      .post("/api/admin/product")
      .field("name", "Invalid Brand Product")
      .field("price", "1000")
      .field("brandId", "invalidid")
      .attach("image", path.resolve(__dirname, "sample.png"));

    expect(res.statusCode).toBe(500);
    expect(res.body.success).toBe(false);
  });

  test("can create a new product", async () => {
    const res = await request(app)
      .post("/api/admin/product")
      .field("name", "Test Product")
      .field("price", "1999")
      .field("brandId", brandId)
      .attach("image", path.resolve(__dirname, "sample.png"));

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe("Test Product");
    productId = res.body.data._id;
  });

  test("can fetch all products", async () => {
    const res = await request(app).get("/api/admin/product");
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThanOrEqual(1);
  });

  test("can fetch products with search", async () => {
    const res = await request(app).get("/api/admin/product?search=Test");
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data[0].name).toContain("Test");
  });

  test("should return 400 on invalid product ID when fetching by id", async () => {
    const res = await request(app).get("/api/admin/product/invalidid");
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Invalid product ID");
  });

  test("should return 404 if product not found by id", async () => {
    const res = await request(app).get("/api/admin/product/64d404b92b7ad07092c2ecf0");
    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Product not found");
  });

  test("can fetch a product by id", async () => {
    const res = await request(app).get(`/api/admin/product/${productId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe("Test Product");
  });

  test("can update a product", async () => {
    const res = await request(app)
      .put(`/api/admin/product/${productId}`)
      .field("name", "Updated Product")
      .field("price", "2999")
      .field("brandId", brandId)
      .attach("image", path.resolve(__dirname, "sample.png"));

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe("Updated Product");
    expect(res.body.data.price).toBe(2999);
  });

  test("should return 400 on invalid product ID when updating", async () => {
    const res = await request(app)
      .put("/api/admin/product/invalidid")
      .field("name", "Fail Update")
      .field("price", "1234")
      .field("brandId", brandId);

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Invalid product ID");
  });

  test("should return 404 on updating non-existent product", async () => {
    const res = await request(app)
      .put("/api/admin/product/64d404b92b7ad07092c2ecf0")
      .field("name", "Nonexistent Update")
      .field("price", "1234")
      .field("brandId", brandId);

    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Product not found");
  });

  test("should return 400 on invalid product ID when deleting", async () => {
    const res = await request(app).delete("/api/admin/product/invalidid");
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Invalid product ID");
  });

  test("should return 404 on deleting non-existent product", async () => {
    const res = await request(app).delete("/api/admin/product/64d404b92b7ad07092c2ecf0");
    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Product not found");
  });

  test("can delete a product", async () => {
    const res = await request(app).delete(`/api/admin/product/${productId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("Product deleted");
  });
});
