fetch('/api/health')
  .then(response => {
    if (!response.ok) {
      throw new Error('Сервер вернул ошибку');
    }
    return response.json();
  })
  .then(data => {
    document.getElementById('server-status').textContent =
      `Сервер работает: ${data.status}`;
  })
  .catch(() => {
    document.getElementById('server-status').textContent =
      'Не удалось подключиться к серверу';
  });