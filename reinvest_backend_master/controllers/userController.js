import {userSchema} from '../models/user';
import {propertySchema} from '../models/property'
import {registerValidation,loginValidation} from '../validation';
import mongoose from 'mongoose';

import jwt, { verify } from 'jsonwebtoken';
import { verifyToken } from '../validate-token';

require('dotenv').config();

const User = mongoose.model('User',userSchema);

const Property = mongoose.model('Property',propertySchema);

export const userSignUp = async (req,res) =>{

  const {error} = registerValidation(req.body);

  if(error) return res.status(400).json({error: error.details[0].message});

  const emailExists = await User.findOne({email:req.body.email});

  if(emailExists) return res.status(400).json({message: "Email already exists"});

  const user = new User({
    email: req.body.email,
    password: req.body.password,
    firstName: req.body.firstName,
    lastName: req.body.lastName
  }).save((err,response) =>{
    if(err){
      res.status(400).send(err);
    }
    res.status(200).send(response);
  });
}


export const userLogIn = async (req, res) =>{
  
  //res.setHeader('Access-Control-Allow-Credentials', true);
  if(req.cookies.auth != null) return res.send({message: 'You are already logged in. Please Log out before signing in again.'})
  const {error} = loginValidation(req.body);

  if(error) return res.status(400).json({error: error.details[0].message});

  User.findOne({'email':req.body.email},(err, user) =>{
    if(!user) return res.status(400).json({message: err});

    user.comparePassword(req.body.password,(err,isMatch) =>{
      if(err) throw err;
      if(!isMatch) return res.status(400).json({
        message: "Wrong Password"
      });

      user.generateToken((err,user)=>{
        if(err) return res.status(400).send(err);
        res.cookie('auth',user.token).json({
            isAuth : true,
            id : user._id,
            email : user.email
        });
        return res.status(200).send(user);
    });    
    });
  });
}

export const userLogOut = (req,res) =>{

  verifyToken(req, res, (token) => {
    User.findByToken(token,(err,user) =>{
      if(err) throw err
      user.deleteToken(req.cookies.token,(err,user)=>{
        if(err) return res.status(400).send(err);
        res.clearCookie('auth');
        return res.status(200).json({message: 'Successfully signed out'});
    });
    })
  })
}

export const deleteUser = (req,res) =>{
  verifyToken(req,res,(Token) =>{
    Property.deleteMany({ownerID : Token}).then(function(){
      console.log('Data Deleted');
    }).catch(function(err){
      console.log(err);
    });
    User.findByToken(req.cookies.auth,(err,user) =>{
      if(err) throw err
      user.deleteToken(req.cookies.token,async (err,user)=>{
        if(err) return res.status(400).send(err);
        User.findOneAndDelete(Token,(err,data) =>{
          if(err) return res.status(400).send(err);
          res.clearCookie('auth');
          res.sendStatus(200);
        });
      });
    })
  })
}

export const checkLoggedIn = (req,res) =>{
  verifyToken(req,res,(Token) =>{
    if(Token == req.body.auth){
      return res.status(200).json({message: 'Token is valid'});
    }
    return res.status(401).json({message: 'Token is not valid'});
  })
}