const request = require("supertest");
const app = require("../app");
const Review = require("../models/review_models");

describe("GET /review/product/:id", () => {
    it("should return all reviews with the same product id", async () => {
        const productId = "627a7d7f1c5f2f2de4f7a7fb";
        const res = await request(app).get(`/review/product/${productId}`);

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    product_id: productId,
                }),
            ])
        );
    });
});

describe("PATCH /review/:id", () => {
    it("should update review with the given id", async () => {
        const reviewId = "627a7d7f1c5f2f2de4f7a7fd";
        const updatedReview = {
            rating: 4,
        };
        const res = await request(app).patch(`/review/${reviewId}`).send(updatedReview);

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data).toEqual(
            expect.objectContaining({
                rating: 4,
            })
        );
    });
});
