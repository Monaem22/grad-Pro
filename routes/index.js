const categoeyroute=require("./categoryroutes")
const projectwarehouseroute=require("./project_Warehouseroutes")
const authroute=require('./authroutes.js')
const favourtielistroute=require('./favouriteListroutes.js');
const userroute=require('./userroutes.js')




const mountRoutes=(server)=>{
    //amount routes
    
    server.use("/api/v1/categories", categoeyroute);
    server.use("/projectwarehouse", projectwarehouseroute);
    server.use("/auths", authroute);
    server.use('/favourite',favourtielistroute)
<<<<<<< HEAD

=======
    server.use('/users',userroute)
>>>>>>> f8fff45bae413ff4093f1cd0ff5a66b1373a0836
    }
    

module.exports= mountRoutes;