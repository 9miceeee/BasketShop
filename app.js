
const express = require('express');
const path = require('path');
const { poolPromise } = require('./db');

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  if (req.path.startsWith('/api/')) {
    res.setHeader('X-Robots-Tag', 'noindex, nofollow');
  }

  next();
});

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

// Маршруты для SEO файлов (напрямую)
app.get('/robots.txt', (req, res) => {
  res.type('text/plain');
  res.send('User-agent: *\nDisallow: /api/\nSitemap: http://localhost:3000/sitemap.xml');
});

app.get('/sitemap.xml', (req, res) => {
  res.type('application/xml');
  res.send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
   <url>
      <loc>http://localhost:3000/</loc>
      <lastmod>2026-10-28</lastmod>
   </url>
</urlset>`);
});

// Отдаем robots.txt
app.get('/robots.txt', (req, res) => {
  res.type('text/plain');
  res.send(`User-agent: *
Disallow: /login
Disallow: /api/
Sitemap: http://localhost:3000/sitemap.xml`);
});

// Отдаем sitemap.xml
app.get('/sitemap.xml', (req, res) => {
  res.type('application/xml');
  res.send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
   <url>
      <loc>http://localhost:3000/</loc>
      <lastmod>2026-10-28</lastmod>
   </url>
</urlset>`);
});

// Закрываем API от индексации (как в примере)
app.use('/api', (req, res, next) => {
  res.set('X-Robots-Tag', 'noindex, nofollow');
  next();
});

module.exports = app;
