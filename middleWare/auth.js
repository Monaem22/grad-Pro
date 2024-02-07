const adminAuth = (req ,res ,next)=> {
    const {admin}= req.headers;
    if (admin == 1) next();
    else {
        res.send("not authorized");

    }
        


}

const studentAuth = (req ,res ,next)=> {
    const {student}= req.headers;
    next()
    
}


module.exports = {studentAuth,adminAuth}