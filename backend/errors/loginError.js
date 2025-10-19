const AppError = require("./appError");

class LoginError extends AppError {
    static existingEmailAndPassword() {
      return new LoginError("Email and password are required", 400);
    }

    static incorrectPassword() {
        return new LoginError("Password incorrect", 401);
    }

    static incorrectEmail() {
        return new LoginError("Email incorrect", 404);
    }
    
    static invalidPasswordFormat() {
      return new LoginError("Invalid password format, the password must be a SHA-512 hash of 128 characters", 400);
    }
}

module.exports = LoginError;