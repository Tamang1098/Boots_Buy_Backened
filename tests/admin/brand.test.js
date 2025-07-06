const request = require("supertest");
const app = require("../../index");
const Brand = require("../../models/Brand");
const mongoose = require("mongoose");
const path = require("path");

afterAll(async () => {
  await mongoose.disconnect();
});

describe("Brand API", () => {
  let brandId;

  beforeAll(async () => {
    await Brand.deleteMany({});
  });

  test("can create a new brand", async () => {
    const res = await request(app)
      .post("/api/admin/brand")
      .field("brandname", "Nike")
      .attach("image", path.resolve(__dirname, "sample.png"));

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.brandname).toBe("Nike");

    brandId = res.body.data._id;
  });

  test("can fetch all brands", async () => {
    const res = await request(app).get("/api/admin/brand");
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  test("can fetch a brand by id", async () => {
    if (!brandId) return console.log("Skipping fetch by id: brandId undefined");
    const res = await request(app).get(`/api/admin/brand/${brandId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.brandname).toBe("Nike");
  });

  test("can update a brand", async () => {
    if (!brandId) return console.log("Skipping update: brandId undefined");
    const res = await request(app)
      .put(`/api/admin/brand/${brandId}`)
      .field("brandname", "Nike Updated");

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.brandname).toBe("Nike Updated");
  });

  test("can delete a brand", async () => {
    if (!brandId) return console.log("Skipping delete: brandId undefined");
    const res = await request(app).delete(`/api/admin/brand/${brandId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("Brand deleted");
  });
});
