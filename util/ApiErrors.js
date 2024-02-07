class ApiErrors extends Error{
    constructor(message,statusCode){
        super(message)
        this.message=message
        this.statusCode=`${statusCode}`.startsWith(4)?"fail":"error"
        this.isOpertional=true
    }
}

module.exports=ApiErrors;