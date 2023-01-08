const fs = require("fs");

const requestHandler = (req, res) => {
  const url = req.url;
  const method = req.method;

  if (url === "/") {
    res.write("<html>");
    res.write("<head><title>Enter Your Name</title></head>");
    res.write(
      '<body><form method="POST" action="/message"><input type="text" name="message" /><button type="submit">Submit</button></form></body>'
    );
    res.write("</head>");
    return res.end();
  }

  if (url === "/message" && method === "POST") {
    const body = [];

    req.on("data", (chunk) => {
      body.push(chunk);
    });

    return req.on("end", () => {
      const parsedData = Buffer.concat(body).toString();
      const message = parsedData.split("=")[1];
      fs.writeFile("message.text", message, (err) => {
        res.statusCode = 302;
        res.setHeader("Location", "/");
        return res.end();
      });
    });
  }

  res.setHeader("Content-Type", "text/html");
  res.write("<html>");
  res.write("<head><title>First App</title></head>");
  res.write("<body><h1>Welcome To The First Node App</h1></body>");
  res.write("</head>");
  res.end();
};

// module.exports = requestHandler;

// module.exports = {
//     handler: requestHandler,
//     someText: 'Some hardcoded text'
// };

// exports.handler = requestHandler;
// exports.someText = "Some Hard Coded Text";
