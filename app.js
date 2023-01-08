const express = require("express");
const path = require("path");

const app = express();
const bodyParser = require("body-parser");
const expressHbs = require("express-handlebars");

const {router} = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const rootDir = require('./util/path');

//set another template engine which is not built in express as pug
app.engine('hbs', expressHbs({ layoutsDir: 'views/layouts/', defaultLayout: 'main-layout', extname: 'hbs' }));

//set the default template engine as handlebars
// app.set('view engine', 'hbs');

//set the directory of the template views
// app.set('views', 'views/hbs');

//set the default template engine as pug
// app.set('view engine', 'pug');

//set the directory of the template views
// app.set('views', 'views/pug');

//set the default template engine as ejs
app.set('view engine', 'ejs');

//set the directory of the template views
app.set('views', 'views/ejs');

//used to parse the body of the request
app.use(bodyParser.urlencoded({ extended: false }));

//used to serve the static file within specific directory
app.use(express.static(path.join(__dirname, 'public')));

app.use("/admin", router);
app.use(shopRoutes);

app.use((req, res, next) => {
  res.status(404).render('404', {pageTitle: 404})
});

app.listen(8080);
