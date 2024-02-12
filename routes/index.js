const categoeyroute=require("./categoryroutes")
const projectwarehouseroute=require("./project_Warehouseroutes")
const authroute=require('./authroutes.js')
const favourtielistroute=require('./favouriteListroutes.js');
const userroute=require('./userroutes.js')
const notificationroute=require('./notificationroutes.js')


const mountRoutes=(server)=>{
    //amount routes
    server.use("/api/v1/categories", categoeyroute);
    server.use("/projectwarehouse", projectwarehouseroute);
    server.use("/auths", authroute);
    server.use('/favourite',favourtielistroute)
    server.use('/users',userroute)
    server.use('/notifications',notificationroute)
    }
    
module.exports= mountRoutes;