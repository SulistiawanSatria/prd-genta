const request = require("supertest");
const app = require("../app");
const Product = require("../models/product_models");

describe("GET /product", () => {
  it("should return all products", async () => {
    const response = await request(app).get("/product");
    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        success: true,
        message: "Products found",
        data: expect.arrayContaining([
          expect.objectContaining({
            name: expect.any(String),
            price: expect.any(Number),
            description: expect.any(String),
            image: expect.any(String),
            rating: expect.any(Number),
          }),
        ]),
      })
    );
  });
});

describe("GET /product/:id", () => {
  it("should return a product by id", async () => {
    const product = await Product.findOne();
    const response = await request(app).get(`/product/${product._id}`);
    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        success: true,
        message: "Product found",
        data: expect.objectContaining({
          name: product.name,
          price: product.price,
          description: product.description,
          image: product.image,
          rating: product.rating,
        }),
      })
    );
  });

  it("should return 404 if product not found", async () => {
    const response = await request(app).get("/product/1234567890abcdef12345678");
    expect(response.status).toBe(404);
    expect(response.body).toEqual(
      expect.objectContaining({
        success: false,
        message: "Product not found",
      })
    );
  });
});
