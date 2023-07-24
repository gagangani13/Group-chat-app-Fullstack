const { User } = require("../model/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { ForgotPassword } = require("../model/forgotPassword");
const database = require("../database/database");
require("dotenv").config();

function userEncrypt(id) {
  return jwt.sign(id, process.env.JWT_SECRET);
}

module.exports.newUser = async (req, res, next) => {
  const { email, password, name, mobile } = req.body;
  if (!email || !password || !name || !mobile) {
    return res.status(400).json({ err: "Invalid Input" });
  }
  bcrypt.hash(password, 10, async (err, result) => {
    if (err) {
      return res.send(err);
    }
    try {
      const createUser = await User.create({
        email: email,
        password: result,
        name: name,
        mobile: mobile,
      });
      console.log(createUser);
      res.status(201).json({ message: "User Added" });
    } catch (error) {
      res.status(200).send({ message: "User Exists" });
    }
  });
};

module.exports.loginUser = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  if (!email || !password) {
    return res.status(200).send({ message: "Invalid Input", ok: false });
  }
  try {
    const getUser = await User.findAll({ where: { email: email } });
    bcrypt.compare(password, getUser[0].password, (err, result) => {
      if (err) {
        throw new Error("Something went wrong");
      } else if (result) {
        res.status(200).send({
          message: "User Logged in",
          ok: true,
          emailId: getUser[0].email,
          id: getUser[0].id,
          idToken: userEncrypt(getUser[0].id),
          name:getUser[0].name
        });
      } else {
        res.status(200).send({ message: "Incorrect password", ok: false });
      }
    });
  } catch (error) {
    res.status(200).send({ message: "User doesn't exists", ok: false });
  }
};

module.exports.forgotPassword = async (req, res, next) => {
  const Sib = require("sib-api-v3-sdk");
  const Client = Sib.ApiClient.instance;
  const apiKey = Client.authentications["api-key"];
  apiKey.apiKey = process.env.FORGOT_PASSWORD;
  const tranEmailApi = new Sib.TransactionalEmailsApi();
  const sender = {
    email: "gagangani17@gmail.com",
    name: "Gagan",
  };
  const receiver = [
    {
      email: req.body.email,
    },
  ];
  const transactEmail = await tranEmailApi.sendTransacEmail({
    sender: sender,
    to: receiver,
    subject: "Chat App",
    textContent: "You can change your password here",
    htmlContent: `<div><h1>Hello Boss</h1><a href="https://chat-app-server-k570.onrender.com/Password/${req.UUID}">Change your password here</a></div>`,
  });
  try {
    res.send({ ok: true, message: "Email sent" });
  } catch (error) {
    res.send({ ok: false, message: "Invalid email id" });
  }
};

module.exports.updatePassword = async (req, res, next) => {
  const t = await database.transaction();
  try {
    const { password } = req.body;
    const UUID = req.params.Id;
    if (!password) {
      return res.send({ message: "Invalid Input" });
    }
    bcrypt.hash(password, 10, async (err, result) => {
      if (err) {
        return res.send(err);
      } else if (result) {
        try {
          const findPassword = await ForgotPassword.findOne(
            { where: { id: UUID } },
            { transaction: t }
          );
          if (findPassword === null) {
            return res.send({ message: "Password change failed", ok: false });
          }
          const findUser = await User.findOne(
            { where: { id: findPassword.UserId } },
            { transaction: t }
          );
          const updatePassword = await findPassword.update(
            { isActive: false },
            { transaction: t }
          );
          const updateUser = await findUser.update(
            { password: result },
            { transaction: t }
          );
          t.commit();
          res.send({ message: "Password changed successfully", ok: true });
        } catch (error) {
          t.rollback();
          res.send({ message: "Password change failed", ok: false });
        }
      }
    });
  } catch (error) {
    t.rollback();
    res.send({ message: "Password change failed", ok: false });
  }
};
