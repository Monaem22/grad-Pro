const { default: mongoose } = require("mongoose");

const dbconnection = () => {
  mongoose
    .connect(process.env.DB_URL)
    .then((conn) => {
      console.log("connction database :" + conn.connection.host);
    })
    .catch((err) => {
      console.log("database faild" + err);
      process.exit(1);
    });
};

module.exports = dbconnection;
