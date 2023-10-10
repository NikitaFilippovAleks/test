const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
  // Проверяем, что запрос приходит к корневому пути "/"
  if (req.url === '/') {
    // Если да, отправляем приветственное сообщение
    res.write('Добро пожаловать на сервер с изображениями!');
    res.end();
  } else {
    // Иначе, обрабатываем запрос на отображение изображения
    // Получаем имя файла из URL запроса
    const fileName = req.url.slice(1);
    // Считываем данные из файла
    fs.readFile(fileName, (err, data) => {
      if (err) {
        // Если произошла ошибка чтения файла, отправляем ошибку
        res.statusCode = 404;
        res.end(`Ошибка: файл ${fileName} не найден!`);
      } else {
        console.log('getting image')
        // Иначе, отправляем содержимое файла
        res.setHeader('Content-Type', 'image/jpeg'); // Указываем тип содержимого - jpeg
        res.end(data);
      }
    });
  }
});

// Запускаем сервер на порту 3000
server.listen(3001, () => console.log('Сервер запущен на порту 3001...'));
