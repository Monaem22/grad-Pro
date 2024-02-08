const ApiErrors = require("../util/ApiErrors")

const handlejwtinvalidsignature=()=>{
new ApiErrors("Inavalid token please try again..",401)
}

const handleJwtExpired = () =>
  new ApiErrors('Expired token, please login again..', 401);

const GlobalError=(err, req, res, next) => {
    err.statusCode=err.statusCode||500
    err.status=err.status||'error'
    if(process.env.NODE_ENV=="development"){
        sendErrorForDev(err,res)
    }else{
        if(err.name=="JsonWebTokenError") err=handlejwtinvalidsignature()
        if(err.name=="TokenExpiredError") err=handleJwtExpired()

        sendErrorForPro(err,res)
    }

}

const sendErrorForDev=(err,res)=>{
    res.status(400).json({ 
        status:err.status,
        error:err,
        message:err.message,
        stack:err.stack
     })
}

const sendErrorForPro=(err,res)=>{
    res.status(400).json({ 
        status:err.status,
        message:err.message,
     })
}

module.exports=GlobalError