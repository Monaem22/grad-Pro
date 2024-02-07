const router = require("express").Router();



router.use("/admin",(req, res, next) => {
    console.log('Time: ', Date());
    res.send("admin time");
})

router.get("/id-ad",(req, res, next) => {
    res.send("admin1");
    console.log("ad");
})

module.exports = router;