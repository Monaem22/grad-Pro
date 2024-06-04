const express = require("express");
const app = express();
const dotenv = require("dotenv");
const Routes = require("./routes");
const dbConnection = require("./config/DB_connection");
const cors = require("cors");
const cookieParser = require('cookie-parser')


dotenv.config();
dbConnection();

// global middleware
const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,            //access-control-allow-credentials:true
  optionSuccessStatus: 200
}

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/app/project", express.static("./Uploads-projects"));
app.use("/app/user", express.static("./Uploads-transcript"));
app.use("/app/user", express.static("./Uploads-image"));

app.use("/app", Routes);
// app.all("*", (req, res, next) => {
//   next(new Error(`\n cant find your route:${req.originalUrl} \n`));
// });

app.all('*',(req,res)=>{
  res.send({
      massage:"not found routes"
  })
})

app.listen(process.env.port, () => {
  console.log(`the server is running on port : ${process.env.port} on  http://localhost:${process.env.port}`);
});
