const User=require('../models/User')
const bcrypt=require("bcrypt")
const jwt = require("jsonwebtoken")
const nodemailer = require("nodemailer")

exports.registerUser = async(req,res)=>{
    const{username,email,password,address,mobilenumber}=req.body

    //validation

    if(!username || !email || !password || !address || !mobilenumber){
        return res.status(400).json(
            {"success":false,"message":"Missing fields"}
        )
    }

    // db logic in try/catch
    try{
        const existingUser = await User.findOne(
            {
                $or:[{"username":username},
                    {"email":email}
                ]
            }
        )
        if(existingUser){
            return 
            res.status(400).json(
                {
                    "success":false,
                    "message":"User exists"
                }
            )
        }

        // hash password
        const hasehedPassword=await bcrypt.hash(
            password,10
        ) // 10 is complexity

        const newUser = new User({
            username,
            email,
            password: hasehedPassword,
            address,
            mobilenumber
        })
        await newUser.save()
        return res.status(201).json(
            {
                "success":true,
                "message":"User Registered"
            }
        )
       

    } catch(err){
        return res.status(500).json(
            {
                "success":false,"message":"Server error"
            }
        )
    }

}


exports.loginUser = async (req, res) => {
    const { email, password } = req.body
    // validation
    if (!email || !password) {
        return res.status(400).json(
            { "success": false, "message": "Missing field" }
        )
    }
    try {
        const getUser = await User.findOne(
            { email: email }
        )
        if (!getUser) {
            return res.status(403).json(
                { "success": false, "message": "User not found" }
            )
        }
        const passwordCheck = await bcrypt.compare(password, getUser.password) // pass, hashed password
        if (!passwordCheck) {
            return res.status(403).json(
                { "success": false, "message": "Invalid credentials" }
            )
        }
             // Check what secret is used
        console.log("JWT Secret =>", process.env.SECRET);
        const payload = {
            "_id": getUser._id,
            "role": getUser.role,
            "email": getUser.email,
            "username": getUser.username
        }
        const token = jwt.sign(payload, process.env.SECRET,
            { expiresIn: "7d" }
        )
        return res.status(200).json(
            {
                "success": true,
                "message": "Login Successful",
                "data": getUser,
                "token": token // return token in login
            }
        )
    } catch (err) {
        return res.status(500).json(
            { "success": false, "message": "Server error" }
        )
    }
}


////////////////////// For Email///

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
exports.sendResetLink = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const token = jwt.sign({ id: user._id }, process.env.SECRET, {
      expiresIn: "15m",
    });
       const resetUrl = `${process.env.CLIENT_URL}/reset-password/${token}`;

    const mailOptions = {
      from: `"Your App" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Reset your password",
      html: `<p>Click <a href="${resetUrl}">here</a> to reset your password.</p>`,
    };
        transporter.sendMail(mailOptions, (err, info) => {
      if (err)
        return res
          .status(500)
          .json({ success: false, message: "Error sending email" });
      console.log("Email sent: " + info.response);
      res.status(200).json({ success: true, message: "Reset email sent" });
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.SECRET);
    const hashed = await bcrypt.hash(password, 10);
    await User.findByIdAndUpdate(decoded.id, { password: hashed });

    res.status(200).json({ success: true, message: "Password updated" });
  } catch (err) {
    res
      .status(400)
      .json({ success: false, message: "Invalid or expired token" });
  }
};









