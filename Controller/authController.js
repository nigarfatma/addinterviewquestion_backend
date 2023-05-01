const user = require("../Model/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cron = require("node-cron");
const otp = require("../Model/otp");
const nodemailer = require("nodemailer");

const common = require("../Otp/Otpmathod");
const salt = 10;
const mysecret = "mysecret";
// SIGNUP OF USER
exports.signup = async (req, res) => {
  // const {name,email,password}=req.body;
  let data = req.body;
  console.log(data, "data");
    const isExist=await user.findOne({email:data.email});
    if(!isExist){
    bcrypt.genSalt(salt,async function(err, salt) {
      bcrypt.hash(data.password, salt, async function(err, hash) {

      data={...data,password:hash}
         const createRespose=await user.create(data);
         console.log(createRespose,"cr");
      data={...data,password:hash}
          res.send({data });
      });
  });
    }
 
    else{
      res.send({error: 'user already exist' });
    }
};

// LOGIN
exports.login = async (req, res, next) => {
  let data = req.body;
  console.log(data);
  const isExist = await user.findOne({ email: data.email });
  console.log(isExist);
  if (isExist) {
    bcrypt.compare(
      data.password,
      isExist.password,
      async function (err, response) {
        // res === true
        if (response) {
          const token = jwt.sign(
            {
              // exp: Math.floor(Date.now() / 1000) + 60 * 60,
              data: isExist._id,
              name: isExist.fName,
            },
            mysecret,
            {
              expiresIn: "365d", // expires in 365 days
            }
          );
          console.log("name", isExist.fName);
          //("token-->", token);
          res.send({
            statusCode: 200,
            access_token: token,
            createRespose: isExist,
            name: isExist.fName,
          });
        }
      }
      
    );
  } else {
    res.send({
      error: "User Not Verified or Invalid Credentials",
      statusCode: 204,
     
    });
  }
  
};
// GENERATE OTP


cron.schedule("* * * * * ", async () => {
  const data = await otp.find({});
  data.forEach(async (element) => {
    const current = Date.now();
    const otpTime = element.createdAt.getTime();
    const minutes = Math.floor((current - otpTime) / 60000);
    if (minutes > 10) {
      const updateOtp = await otp.deleteOne({ _id: element._id });
    }
  });
  // console.log("otp-->",data)
});

exports.forgotPassword = async (req, res, next) => {
  const { email } = req.body;
  const isExist = await user.findOne({ email: email });
  if (isExist) {
    const otpass = await common.getOtp();
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "iqbal87anwar@gmail.com",
        pass: "wacrcrrfaukybbcs",
      },
    });

    var mailOptions = {
      from: "iqbal87anwar@gmail.com",
      to: isExist.email,
      subject: "One time Password for reset your Password",
      text: `Your one time Password for reset your account on STS Admin is ${otpass}`,
    };

    transporter.sendMail(mailOptions, async function (error, info) {
      if (error) {
        console.log(error);
      } else {
        const objOtp = {
          otp: otpass,
          email: isExist.email,
          createdAt: new Date(),
        };
        const createResponse = await otp.create(objOtp);
        console.log(createResponse);
        res.send({ success: "OTP sent successfully", email: isExist.email });
      }
    });
  } else {
    res.send({ error: "Email not found" });
  }
};

exports.verifyOtp = async (req, res, next) => {
  const { otpass, email } = req.body;
  const isExist = await otp.findOne({ otp: otpass, email: email, status: "Y" });
  console.log("Otp Check", isExist);
  if (isExist) {
    // console.log(" Date",(Date.now()))
    const otpexp = Date.now();

    otpTime = isExist.createdAt.getTime();
    const minutes = Math.floor((otpexp - otpTime) / 60000);
    console.log("Check time", minutes);
    if (minutes > 10) {
      res.send({ error: "OTP expired" });
      const updateOtp = await otp.deleteOne({ email: email });
    } else {
      const updateOtp = await otp.deleteOne({ email: email });
      res.send({ success: "OTP matched", email: isExist.email, code: "200" });
    }
  } else {
    res.send({ error: "Incorrect OTP " });
  }
};

exports.resetPassword = async (req, res, next) => {
  const { email, newPassword } = req.body;
  const isExist = await user.findOne({ email: email });
  console.log("NewPassword", isExist);
  if (isExist) {
    bcrypt.genSalt(10, async function (err, salt) {
      bcrypt.hash(newPassword, salt, async function (err, hash) {
        const updateResponse = await user.updateOne(
          { email: email },
          { $set: { password: hash } }
        );
        console.log("NewPassword", updateResponse);
        res.send({ success: "Password Reset Successfully " ,result: isExist});
      });
    });
  } else {
    res.send({ error: "Password not reset " });
  }
};