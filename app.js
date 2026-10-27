
const express = require('express');
const path = require('path');
const { poolPromise } = require('./db');

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const demoProducts = [
  {
    ID_PRODUCT: 1,
    NAME: 'Баскетбольная футболка',
    DESCRIPTION: 'Футболка для тренировок',
    PRICE: 1990,
    IMAGE_URL: 'https://placehold.co/400x500?text=Basketball+Tee',
    CATEGORY_NAME: 'Футболки',
    BRAND_NAME: 'Nike'
  },
  {
    ID_PRODUCT: 2,
    NAME: 'Баскетбольное джерси',
    DESCRIPTION: 'Джерси для игры',
    PRICE: 2990,
    IMAGE_URL: 'https://placehold.co/400x500?text=Basketball+Jersey',
    CATEGORY_NAME: 'Джерси',
    BRAND_NAME: 'Jordan'
  }
];

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', project: 'BasketShop' });
});

app.get('/api/products', async (req, res) => {
  if (process.env.USE_DEMO_DATA === 'true') {
    return res.json(demoProducts);
  }

  try {
    const pool = await poolPromise;
    const result = await pool.request().query(`
      SELECT
        p.ID_PRODUCT,
        p.NAME,
        p.DESCRIPTION,
        p.PRICE,
        p.IMAGE_URL,
        c.NAME AS CATEGORY_NAME,
        b.NAME AS BRAND_NAME
      FROM PRODUCTS p
      INNER JOIN CATEGORIES c ON p.ID_CATEGORY = c.ID_CATEGORY
      LEFT JOIN BRANDS b ON p.ID_BRAND = b.ID_BRAND
      WHERE p.IS_ACTIVE = 1
      ORDER BY p.ID_PRODUCT;
    `);

    res.json(result.recordset);
  } catch (error) {
    console.error('Ошибка получения товаров:', error.message);
    res.status(500).json({ error: 'Не удалось загрузить товары' });
  }
});

module.exports = app;
