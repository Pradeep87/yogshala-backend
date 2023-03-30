const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("./catchAsyncError");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

exports.isAuthenticatedUser = catchAsyncError(async (req, res, next) => {
   
    console.log(req.cookies)
    const { token } = req.cookies;
    if (!token) {
        return next(new ErrorHandler("Please Login to access this resource", 401));
    }
    const decodedData = jwt.verify(token, process.env.SECRET_KEY);
    req.user = await User.findById(decodedData.id);
    next();
});

exports.authorizedRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(
                new ErrorHandler(
                    `Role: ${req.user.role} is not allowed to access this resouce `,
                    403
                )
            );
        }

        next();
    };
};



