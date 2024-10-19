const mongoose = require("mongoose");

require("dotenv").config({
    path: "../.env",
});

// create Admin User Schema For Admin User Model

const adminSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    isSuperAdmin: {
        type: Boolean,
        default: false,
    },
    creatingDate: {
        type: Date,
        default: Date.now(),
    },
});

// create Admin User Model In Database

const adminModel = mongoose.model("admin", adminSchema);

// require bcryptjs module for password encrypting

const { hash } = require("bcryptjs");

const userInfo = {
    firstName: "Test",
    lastName: "Account",
    email: process.env.MAIN_ADMIN_EMAIL,
    password: process.env.MAIN_ADMIN_PASSWORD,
    isSuperAdmin: true,
}

async function create_admin_user_account() {
    try {
        await mongoose.connect(process.env.DB_URL);
        let user = await adminModel.findOne({ email: userInfo.email });
        if (user) {
            await mongoose.disconnect();
            return "Sorry, Can't Insert Admin Data To Database Because it is Exist !!!";
        }
        const encrypted_password = await hash(userInfo.password, 10);
        userInfo.password = encrypted_password;
        const new_admin_user = new adminModel(userInfo);
        await new_admin_user.save();
        await mongoose.disconnect();
        return "Ok !!, Create Admin Account Process Has Been Successfuly !!";
    } catch(err) {
        await mongoose.disconnect();
        throw Error(err);
    }
}

create_admin_user_account().then((result) => console.log(result));