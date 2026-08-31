const request = require('supertest');
const { expect } = require('chai');
const mongoose = require('mongoose');
require('dotenv').config();
const app = require('../src/app');

describe('Notes API', () => {
  let token;
  let noteId;

  before(async function() {
    this.timeout(10000);
    await mongoose.connect(process.env.MONGODB_URI);

    const testUser = {
      name: 'Test Note User',
      email: `notetester_${Date.now()}@test.com`,
      password: 'password123'
    };

    await request(app).post('/api/users/register').send(testUser);

    const loginRes = await request(app).post('/api/users/login').send({
      email: testUser.email,
      password: testUser.password
    });

    token = loginRes.body.token;
  });

  after(async () => {
    await mongoose.connection.close();
  });

  describe('GET /api/notes', () => {
    it('should deny access if no authentication token is provided', async () => {
      const res = await request(app).get('/api/notes');
      
      expect(res.statusCode).to.equal(401);
      expect(res.body.success).to.be.false;
    });

    it('should allow access and return notes if a valid token is provided', async () => {
      const res = await request(app)
        .get('/api/notes')
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.statusCode).to.equal(200);
    });
  });

  describe('POST /api/notes', () => {
    it('should successfully create a new note', async () => {
      const res = await request(app)
        .post('/api/notes')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'My First Test Note',
          content: 'This note was created by an automated test!'
        });
      
      expect(res.statusCode).to.equal(201);
      expect(res.body).to.be.an('object');
    });
  });

});