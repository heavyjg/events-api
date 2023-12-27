// ./src/lambda1.test.ts
import assert from "node:assert";
import test from "node:test";
import app from "./api";
import request from "supertest";

// test("GET /events/:eventId - success", async () => {
//   const res = await request(app).get("/events/1");

//   // Assertions
//   assert.strictEqual(res.statusCode, 200);
//   assert.strictEqual(res.body.eventId, "1");
//   assert.strictEqual(res.body.name, "Event One");
// });

// test("GET /events/:eventId - not found", async () => {
//   const res = await request(app).get("/events/999");

//   assert.strictEqual(res.statusCode, 404);
// });
