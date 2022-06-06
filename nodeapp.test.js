const express = require("express");
const request = require("supertest");
const app = require('./app');
// const routes = require('./Route');
// app.use('/',app);

describe("Get all users", () => {
  it("should get all users", async () => {
    let user = [{
      username: 'vijaygurjar',
      email: 'vijaygurjar@gmail.com'
    }]
    const res = await request(app).get("/api/user/allUsers")

    expect(res.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({username: 'vijaygurjar'})
      ])
    );
  });
});