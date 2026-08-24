const request = require('supertest');
const { expect } = require('chai');
const app = require('../src/app'); 

describe('Server & Health Check API', () => {
  it('should return 200 and a status message on GET /api/health', async () => {
    const res = await request(app).get('/api/health');
    
    expect(res.statusCode).to.equal(200);
    expect(res.body).to.be.an('object');
    expect(res.body).to.have.property('status').that.equals('OK');
    expect(res.body).to.have.property('message').that.equals('Server is healthy'); // <-- Updated!
  });
});