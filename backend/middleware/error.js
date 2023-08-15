const  ErrorHander= require("../utils/errorHander")

// Error Handling
// Cast Error: it occurs when the id of the product is given less then the total number of digits
// user can give the wrong id by writing all digits and less digits as well
// In simple Cast Error is Wrong mongodb id error

module.exports=(err,req,res,next)=>{
    err.statuscode=err.statuscode || 500
    // console.log(err.statuscode)
    err.message=err.message || "Internal server error"
    // console.log(err.message)

    // Wrong mongodb id Error
    if (err.name=="CastError")
    {
        // 400 port number shows the bad request
        const message=`Resource not found. Invalid ${err.path}`
        err=new ErrorHander(message,400)
    }

    res.status(err.statuscode).json({
        success:false,
        // using stackCaptureTrace function to identify the path
        // error:err.stack,
        message:err.message,
        // message:err.message
    })
}