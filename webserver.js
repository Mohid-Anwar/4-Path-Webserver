var http = require("http");
var mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost:27017/cui", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((db) => {
    console.log("Database Connected Successfully");
    var studentSchema = mongoose.Schema({
      name: { type: String, required: true },
      rollno: { type: String, required: true },
    });
    var Student = mongoose.model("Student", studentSchema);
    http
      .createServer(function (req, res) {
        if (req.url === "/" && req.method === "GET") {
          // Route 1
          res.writeHead(200, { "Content-Type": "text/html" });
          res.write("<h1>Welcome to Home Screen</h1>");
          res.write("<a href='/show'>Show Record</a><br>");
          res.write("<a href='/add'>Add Record</a><br>");
          res.write("<a href='/edit'>Edit Record</a><br>");
          res.write("<a href='/delete'>Delete Record</a><br>");
          res.end("<h2></h2>");
        } else if (req.url === "/show" && req.method === "GET") {
          // Route 2: Retrieve and display records
          Student.find()
            .exec()
            .then((data) => {
              res.writeHead(200, { "Content-Type": "text/html" });
              res.end(JSON.stringify(data));
            })
            .catch((err) => {
              console.error("Error fetching students:", err);
              res.writeHead(500, { "Content-Type": "text/html" });
              res.end("<h1>Error fetching students</h1>");
            });
        } else if (req.url === "/add" && req.method === "GET") {
          // Route 3: Add Record
          Student.create({ name: "John Doe", rollno: "XXXX-BCS-048" })
            .then((data) => {
              res.writeHead(200, { "Content-Type": "text/html" });
              res.end(
                `<h1>Student has been created with the following information:</h1><pre>${JSON.stringify(
                  data
                )}</pre>`
              );
            })
            .catch((err) => {
              console.error("Error creating student:", err);
              res.writeHead(500, { "Content-Type": "text/html" });
              res.end("<h1>Error creating student</h1>");
            });
        } else if (req.url === "/edit" && req.method === "GET") {
          // Route 4: Edit Record
          Student.findOneAndUpdate(
            { name: "John Doe" },
            { rollno: "XXXX-CS-012" }
          )
            .then((data) => {
              if (data) {
                res.writeHead(200, { "Content-Type": "text/html" });
                res.write("<h1>Data has been updated with value</h1>");
                res.end(data.toString());
              } else {
                res.writeHead(404, { "Content-Type": "text/html" });
                res.end("<h1>Student not found for editing</h1>");
              }
            })
            .catch((err) => {
              console.error("Error updating student:", err);
              res.writeHead(500, { "Content-Type": "text/html" });
              res.end("<h1>Error updating student</h1>");
            });
        } else if (req.url === "/delete" && req.method === "GET") {
          // Route 5: Delete Record
          // Implement logic to delete a record
          Student.deleteMany({ name: "John Doe" })
            .then((data) => {
              if (data) {
                res.writeHead(200, { "Content-Type": "text/html" });
                res.write("<h1>Following data is deleted</h1>");
                res.end(data.toString());
              } else {
                res.writeHead(404, { "Content-Type": "text/html" });
                res.end("<h1>Student not found for deletion</h1>");
              }
            })
            .catch((err) => {
              console.error("Error updating student:", err);
              res.writeHead(500, { "Content-Type": "text/html" });
              res.end("<h1>Error updating student</h1>");
            });
        } else {
          // Route not found
          res.writeHead(404, { "Content-Type": "text/html" });
          res.end("<h1>Route not found</h1>");
        }
      })
      .listen(8000);
    console.log("Server is listening at http://localhost:8000");
  })
  .catch((err) => {
    console.error("Database connection error:", err);
  });
