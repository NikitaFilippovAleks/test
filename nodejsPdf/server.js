const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
  // if (req.url === '/pdf-test.pdf') {
    // Read the PDF file
    fs.readFile(`.${req.url}`, (err, data) => {
      if (err) {
        res.writeHead(500, {'Content-Type': 'text/plain'});
        res.end('Internal server error');
      } else {
        // Set the necessary headers to allow cross-origin requests
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET');
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

        // Set the content type header
        res.setHeader('Content-Type', 'application/pdf');

        // Send the PDF file as the response
        res.statusCode = 200;
        res.end(data);
      }
    });
  // } else {
  //   // Send a 404 response for all other requests
  //   res.statusCode = 404;
  //   res.end('Page not found');
  // }
});

// Start the server on port 4444
server.listen(4444, () => {
  console.log('Server started on port 4444');
});
