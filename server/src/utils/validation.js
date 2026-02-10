const validator = require("validator");

const signupValidation = (req) => {
    const { name, email, password, companyName, role } = req.body;

    if (!name) {
        throw new Error("Name is required!");
    }

    if (!email || !validator.isEmail(email)) {
        throw new Error("Enter a valid Email ID!");
    }

    if (!password || !validator.isStrongPassword(password)) {
        throw new Error(
            "Password must be strong (min 8 chars, uppercase, lowercase, number, symbol)"
        );
    }

    
    if ((role === "HR" || !role) && !companyName) {
        throw new Error("companyName is required for HR!");
    }
};


const validateEditProfileData = (req)=>{
    const allowedEditFields = ["name" ,"email" , "companyName","profilePhoto"];

    const isEditAllowed = Object.keys(req.body).every(field => allowedEditFields.includes(field));
    return isEditAllowed;
};

module.exports = { signupValidation , validateEditProfileData};