const express = require("express");
const path = require("path");

const app = express();
const bodyParser = require("body-parser");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const errorsController = require("./controllers/error");

//set the default template engine as ejs
app.set('view engine', 'ejs');

//set the directory of the template views
app.set('views', 'views');

//used to parse the body of the request
app.use(bodyParser.urlencoded({ extended: false }));

//used to serve the static file within specific directory
app.use(express.static(path.join(__dirname, 'public')));

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorsController.get404);

app.listen(8080, () => {
    console.log("Server is running on port 8080");
});
