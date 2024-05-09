const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User.model");
const jwt = require("jsonwebtoken");
const router = express.Router();

const { isAuthenticated } = require("../middleware/jwt.middleware");

const saltRounds = 10;

router.post("/register", (req, res, next) => {

  // react body:  {identifier: "ace"}

  const { email, password } = req.body;

  if (email === "" || password === "") {
    next("Provide the email and password");
    return;
  }

  const emailRegex = /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/;
  if (!emailRegex.test(email)) {
    next("Provide a valid email address.");
    return;
  }

  const passwordRegex =
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/;
  if (!passwordRegex.test(password)) {
    next(
      "Password must contain at least one upper case letter, one lower case letter, one digit, one special character or space, and be a minimum of eight characters in length."
    );
    return;
  }

 User.findOne({ email })
    .then((foundUser) => {
      if (foundUser) {
        throw new Error("User already exists. Please login or signup with new email")
      }

      const salt = bcrypt.genSaltSync(saltRounds);
      const hashedPassword = bcrypt.hashSync(password, salt);
      return User.create({ email, password: hashedPassword });
    })
    .then((createdUser) => {
      res.status(201).json("Created.")
      return
      
      })
    .catch(err => {

      next(err.message)
      //FIXME: how to differentiate from internal errors?
      //res.status(500).json({ message: "Internal Server Error" })
      return
    });
});

router.post('/login',(req, res, next)=>{

  const { email, password } = req.body

  if (email === '' || password === '') {
    next( "Provide email and password.")
    return;
  }

  User.findOne({ email })
  .then((foundUser) => {
      
    if (!foundUser) {
      res.status(401).json({ message: "No account associated with this email. Please sign up" })
      return;
    }

    const passwordCorrect = bcrypt.compareSync(password, foundUser.password);
   
        if (passwordCorrect) {

          const { _id, email,imageUrl } = foundUser;
          const payload = { _id, email,imageUrl };
   
          const authToken = jwt.sign( 
            payload,
            process.env.TOKEN_SECRET,
            { algorithm: 'HS256', expiresIn: "6h" }
          );
   
          res.status(200).json({ authToken: authToken });
        }
        else {
          res.status(401).json({ message: "Unable to authenticate the user" });
        }
   
      })
      .catch(err => {res.status(500).json(err)
        console.log(err)});
  
})

router.get('/verify', isAuthenticated, (req, res, next) => {
  console.log(`req.payload`, req.payload);

  res.status(200).json(req.payload);
})





module.exports = router;