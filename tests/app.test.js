const request = require('supertest');
const app = require('../app');

describe('BasketShop API', () => {
  test('проверочный маршрут возвращает статус ok', async () => {
    const response = await request(app).get('/api/health');

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('ok');
    expect(response.body.project).toBe('BasketShop');
  });
});console.log("");