# BasketShop

Веб-приложение интернет-магазина баскетбольной одежды и аксессуаров.

## Используемые технологии

- Node.js
- Express
- Microsoft SQL Server
- Docker
- GitHub Actions
- GitHub Container Registry (GHCR)

## Запуск проекта локально

1. Установите зависимости:

   ```bash
   npm ci
   ```

2. Настройте переменные окружения в файле `.env`.

3. Запустите приложение:

   ```bash
   npm start
   ```

Приложение будет доступно по адресу http://localhost:3000.

## Проверка работоспособности

Проверочный маршрут API: `/api/health`.

Запуск автоматических тестов:

```bash
npm test
```

## Docker

Сборка образа:

```bash
docker build -t basketshop:1.0 .
```

## CI/CD

GitHub Actions автоматически запускает тесты и собирает Docker-образ. При отправке изменений в ветку `main` образ публикуется в GitHub Container Registry.

## Репозиторий

https://github.com/9miceeee/BasketShop
