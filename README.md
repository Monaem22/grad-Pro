
## notification :
deleteMyProject , updateProject , addComment , addlike , addlikeToComment
changeProjectStatus , deleteProject , deleteOneComment , sendMessagePrivte

## sendEmail :  
reset pass , deleteOneComment , deleteProject , changeProjectStatus  , updatePassword
updateUser , uploadAndUpdateimage , blockUser , unBlockUser , deletUser , sendMessagePrivte

## all func viwer can use :
getAllProjects // getRandomProjecs  // searchOnProject


## caching in :
getAllUsersAddedThisProjToFavList  // searchOnProject // getRandomProjecs // searchOnUser
and we can add more depend on business need 

//////////////////////////////////////////////////////////////////////..........................................

# all things that i have applied : 

## deployment :
 on render server 
## api documentation : 
https://documenter.getpostman.com/view/26812826/2sA3kRJjB6

## 1-technologies : 
nodeJS , expressJS , mongoDB , postman and GitHub
## 2-libraries : 
"bcrypt"
"body-parser"
"cookie-parser"
"cors"
"crypto"
"dotenv"
"express"
"express-api-cache"
"joi"
"jsonwebtoken"
"mongodb"
"mongoose"
"mongoose-sequence"
"nodemailer"
"nodemon"
"multer"
......................................
## 3 - strategies :

# Security :

Authentication : Verifying a user's identity (who they are).
Authorization : Determining what a user is allowed to do (permissions).
Input Validation : Sanitizing user input to prevent attacks like SQL injection or cross-site scripting (XSS).
Password Encryption : Storing passwords securely using one-way hashing algorithms (like bcrypt).
JWT (JSON Web Token) : A secure way to represent claims (user information) between a server and a client.
HTTPS : Secure communication protocol that encrypts data in transit, protecting it from eavesdropping.
.......................................................................
# Development Practices :( focus on Building robust, maintainable, and efficient code)

Validation : Ensuring data meets expected criteria before processing.
Middleware : Reusable code that intercepts requests and responses, often for tasks like authentication or logging.
Error Handling : Gracefully catching and responding to errors to prevent crashes and provide informative messages.
................................................................
# Version Control :

VCS (Version Control Systems): Tools like (Git) for tracking changes, collaborating on code, and reverting to previous versions if needed (GitHub).
.............................................................
# Performance : 

### 1-Application Optimization:

       Caching(response caching) : Storing frequently accessed data in memory for faster retrieval, reducing database load.
Express.js Middleware :     Leverage middleware for common tasks like authentication, logging, and static file serving. Popular choices include express-jwt, and express.static.

### 2-Code Optimization :

           Asynchronous Programming : Embrace Node.js's asynchronous nature by leveraging promises or async/await for I/O-bound operations. Don't block the event loop with synchronous code.

###3-Database Optimization :

Mongoose ODM (Object Data Modeling): Utilize Mongoose to define data models, leverage its built-in query optimizations, and avoid raw MongoDB driver usage unless necessary for specific optimizations.

