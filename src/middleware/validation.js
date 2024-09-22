export const validation = (schema) =>{
return (req,res,next)=>{
    const data = schema.validate(req.body , {abortEarly: false})
console.log(data);
if(data.error){
    res.json({err : data.error})
}
}
}
