export const asyncHandler =(fn)=>{
    return(req,res,next)=>{
fn(req,res,next).catch((err) =>{

    next(err)
})
    }
}

export const globalErrorHandling = (err,req,res,next)=>{
    res.status(400).json({ msg:"error",err:err})
    }