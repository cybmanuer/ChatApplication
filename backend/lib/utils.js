// A JWT (JSON Web Token) is a compact, URL-safe, and stateless way to securely transmit information between two parties (typically, a client and a server) as a JSON object. 
// JWTs are commonly used for authentication and authorization in modern web applications.

// How JWT Works (Flow Diagram)
// [1] Login (POST /login with email/password)
//       ↓
// [2] Server verifies user → generates JWT (with user ID inside)
//       ↓
// [3] Server sends JWT to client
//       ↓
// [4] Client stores JWT (in localStorage or cookies)
//       ↓
// [5] On future API requests → client sends JWT in header:
//       Authorization: Bearer <token>
//       ↓
// [6] Server verifies token and returns secure data



import jwt from "jsonwebtoken"

export const generateToken = (userId, res) =>{
    //USER ID -> payload , JWT_Screet -> screet key , expiresIn -> an optional arg
    const token = jwt.sign({userId} , process.env.JWT_SECRET, {
        expiresIn : "7d",
    });


    res.cookie("jwt", token , {
        maxAge : 7 * 24 * 60 * 60 *1000 ,  // the cookie/ session will expire after 7days 
        httpOnly : true,  //to prevent XSS
        sameSite : "strict", // to prevent csrf 
        secure : process.env.NODE_ENV !=="development",  //to check if the request is http | https 

    });

    return token ;
}