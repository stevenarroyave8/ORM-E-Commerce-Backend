const express = require('express');
const routes = require('./routes');
const sequelize = require("./config/connection");
// import sequelize connection

const app = express();
const PORT = process.env.PORT || 3001;

sequelize.authenticate().then((results) => console.log(results));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(routes);

// sync sequelize models to the database, then turn on the server
sequelize.sync({force: true}).then((results) => {
  app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}!`);
  });
});