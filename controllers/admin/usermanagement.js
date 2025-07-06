const User = require("../../models/User")
const bcrypt = require("bcrypt")


//Create

exports.createUser = async (req, res) => {
    const { username, email, password, address, mobilenumber } = req.body
    // validation
    if (!username || !email || !password || !address || !mobilenumber) {
        return res.status(400).json(
            { "success": false, "message":
                "Missing field" }
        )
    }
try {

        // check is user exists with username and email
        const existingUser = await User.findOne(
            {
                $or: [{ username: username },
                    { email: email }]
            }
        )
        if (existingUser) {
            return res.status(400).json({ "success": false, "message": "User exists" })
        }
          // Hash the password
        const hashedPassword = await bcrypt.hash(
            password, 10) // 10 salt/complexity
        // Create new instance of user
        const newUser = new User(
            {
                username,
                email,
                password: hashedPassword,
                address,
                mobilenumber,
            }
        )

            // Save the user data
        await newUser.save()
        return res.status(201).json({ "success": true, "message": "User registered" })
    } catch (e) {
        return res.status(500).json(
            { "success": false, "message": "Server errror" }
        )
    }
}

//// Read All

exports.getUsers = async (req, res) => {
    try{

       // find users, can be used as aggregate for more fine querying
        const users = await User.find();
        return res.status(200).json(
            {
                "success": true,
                "message": "Data fetched",
                "data": users
            }
        )
    }catch(err){
        return res.status(500).json(
            {"success": false, "message": "Server error"}
        )
    }
}
exports.getUsers = async (req, res) => {
    try {
        let { page = 1, limit = 10, search = "" } = req.query;

        page = parseInt(page);
        limit = parseInt(limit);

        const query = search.trim()
            ? { username: { $regex: search.trim(), $options: "i" } }
            : {};

        const users = await User.find(query)
            .skip((page - 1) * limit)
            .limit(limit);

        const total = await User.countDocuments(query);
        const totalPages = Math.ceil(total / limit);

        return res.status(200).json({
            success: true,
            message: "Users fetched successfully",
            data: users,
            pagination: {
                page,
                totalPages,
                limit,
                total
            }
        });
    } catch (err) {
        console.error("Error in getUsers:", err);
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};




/////// Get One

exports.getOneUser = async (req, res) => {
    try{    
        const _id = req.params.id // use mongo id
        const user = await User.findById(_id)
        return res.status(200).json(
            {
                "success": true,
                "message": "One user fetched",
                "data": user
            }
        )
    }catch(err){
        return res.status(500).json(
            {"success": false, "message": "Server Error"}
        )
    }
}



///////////// Update




exports.updateOneUser = async (req, res) => {
    const { email, password } = req.body;
    const _id = req.params.id;

    try {
        // Prepare update fields
        let updateFields = {};

        if (email) {
            updateFields.email = email;
        }

        if (password) {
            // Hash new password
            const hashedPassword = await bcrypt.hash(password, 10);
            updateFields.password = hashedPassword;
        }

        if (Object.keys(updateFields).length === 0) {
            return res.status(400).json({
                success: false,
                message: "No fields to update"
            });
        }

        // Update user
        await User.updateOne(
            { _id: _id },
            { $set: updateFields }
        );

        return res.status(200).json({
            success: true,
            message: "User data updated"
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};



//////////// Delete


exports.deleteOneUser = async (req, res) => {
    try{
        const _id = req.params.id
        const user = await User.deleteOne(
            {
                "_id": _id
            }
        )
        return res.status(200).json(
            {"success": true, "message": "User deleted"}
        )
    }catch(err){
        return res.status(500).json(
            {"succss": false, "message": "Server Error"}
        )
    }
}