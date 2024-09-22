import connectionDB from '../db/connectionDB.js'
import * as routers from '../src/modules/index.routes.js'
import { AppError } from '../utils/classError.js'
import { globalErrorHandling } from '../utils/globalErrorHandler.js'

export const initApp =(app , express) =>{
    const port = process.env.PORT || 3001

app.use(express.json())
app.use("/users",routers.userRouter)
app.use("/company",routers.companyRouter)
app.use("/job",routers.jobRouter)




app.use("*",(req,res,next) =>{
   next (new AppError (`invalid url ${req.originalUrl}`))
    })

app.use(globalErrorHandling)



app.listen(port, () => console.log(`app listening on port ${port}!`))
}