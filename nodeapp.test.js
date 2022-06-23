require("dotenv").config();
const express = require("express");
const request = require("supertest");
const app = require('./server');
const userController = require('./controller/user.controller');
let token;
let userId;
let userData;
let productSample;
let productId;

describe("Register user", () => {
  it("should register user", async () => {
    userData = {
      'firstname': 'test',
      'lastname': 'test',
      'email': 'test@test.com',
      'password': 'password',
      'gender': 'M'
    }
    
    const res = await request(app)
    .post("/api/user/register")
    .send(userData)
    token = res.body.token;
    userId = res.body._id;
    expect(res.body).toHaveProperty('token')
  });
});

describe("Login user", () => {
  it("should Login user", async () => {
    const res = await request(app)
    .post("/api/user/login")
    .send({email: 'test@test.com', password: 'password'})
    token = res.body.token;
    userId = res.body._id;
    expect(res.body).toHaveProperty('token')
  });
});


describe("Get all users", () => {
  it("should get all users", async () => {
    const res = await request(app).get("/api/user/all")
    .query({
      token: token
    })

    expect(res.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({_id: userId})
      ])
    );
  });
});



describe("update user", () => {
  it("should update user", async () => {
    userData = {
      'firstname': 'test',
      'lastname': 'test',
      'gender': 'M',
      "status": false
    }
    const result = {'message': 'success'};
    const res = await request(app).put("/api/user/update")
    .send(userData)
    .query({
      _id: userId,
      token: token
     })
    
     expect(res.body).toMatchObject(result)
  });
});

describe("Get all products", () => {
  it("should get all products", async () => {
    let product = [{
        "_id": "62a099778cfbad4af571c3a7",
        "title": "Brown eggs",
        "type": "dairy",
        "description": "Raw organic brown eggs in a basket",
        "price": 28.1,
        "rating": 4,
        "pic": "brownegg.jpeg",
        "stock": 200,
        "status": true
    }]
    
    const res = await request(app).get("/api/product/all").query({
      token: token
     })
    
    expect(res.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining(product[0])
      ])
    );
  });
});

describe("add product", () => {
  it("should add product", async () => {
    productSample = {
      title: 'test',
      type: 'dairy',
      description: 'test test test',
      price: 28.1,
      rating: 4,
      stock: 100,
      status: true
    }
    const result = {'_id': 'unique key'}
    const res = await request(app).post("/api/product/add")
    .send(productSample)
    .query({
      token: token
     })
     productId = res.body._id;
     
     expect(res.body).toHaveProperty('_id')
  });
});

describe("update product", () => {
  it("should update product", async () => {
    productSample = {
      title: 'test',
      type: 'dairy',
      description: 'test test test',
      price: 28.1,
      rating: 4,
      stock: 100,
      status: false
    }
    const result = {'message': 'success'}
    const res = await request(app).put("/api/product/update")
    .send(productSample)
    .query({
      _id: productId,
      token: token
     })
    
     expect(res.body).toMatchObject(result)
  });
});

describe("Delete product", () => {
  it("delete product", async () => {
    const productReqData = {
      '_id': productId,
      'token': token
    }
    const result = {'message': 'success'}
    
    const res = await request(app)
    .delete("/api/product/remove")
    .query(productReqData)
    
    expect(res.body).toMatchObject(result)
  });
});

describe("Delete user", () => {
  it("delete user", async () => {
    const userData = {
      '_id': userId,
      'token': token
    }
    const result = {'message': 'success'}
    
    const res = await request(app)
    .delete("/api/user/remove")
    .query(userData)
    
    expect(res.body).toMatchObject(result)
  });
});