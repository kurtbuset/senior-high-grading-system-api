const express = require("express");
const router = express.Router();
const Joi = require("joi");
const validateRequest = require("../_middleware/validate-request");
const authorize = require("../_middleware/authorize");
const Role = require("../_helpers/role");
const accountService = require("../accounts/account.service");

// routes
router.post("/authenticate", authenticateSchema, authenticate);
router.post("/refresh-token", refreshToken);
router.post("/revoke-token", authorize(), revokeTokenSchema, revokeToken);
// router.post("/register", registerSchema, register);
router.post("/verify-email", verifyEmailSchema, verifyEmail);
router.post("/forgot-password", forgotPasswordSchema, forgotPassword);
router.post(
  "/validate-reset-token",
  validateResetTokenSchema,
  validateResetToken
);
router.post("/reset-password", resetPasswordSchema, resetPassword);

router.get("/", authorize(Role.SuperAdmin), getAll);
router.get("/teachers", authorize(), getAllTeachers);
router.get("/:id", authorize(Role.SuperAdmin), getById);
router.post("/", authorize(Role.SuperAdmin), createSchema, create);
router.put(
  "/update-password/:id",
  authorize(),
  updatePasswordSchema,
  updatePassword
);
router.put("/:id", authorize(), updateSchema, update);
router.delete("/:id", authorize(), _delete);

module.exports = router;

function getAllTeachers(req, res, next) {
  accountService
    .getAllTeachers()
    .then((teachers) => res.json(teachers))
    .catch(next);
}

function authenticateSchema(req, res, next) {
  const schema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
  });
  validateRequest(req, next, schema);
}

function authenticate(req, res, next) {
  const { username, password } = req.body;
  const ipAddress = req.ip;
  accountService
    .authenticate({ username, password, ipAddress })
    .then(({ refreshToken, ...account }) => {
      setTokenCookie(res, refreshToken);
      res.json(account);
    })
    .catch(next);
}

function refreshToken(req, res, next) {
  const token = req.cookies.refreshToken;
  const ipAddress = req.ip;
  accountService
    .refreshToken({ token, ipAddress })
    .then(({ refreshToken, ...account }) => {
      setTokenCookie(res, refreshToken);
      res.json(account);
    })
    .catch(next);
}

function revokeTokenSchema(req, res, next) {
  const schema = Joi.object({
    token: Joi.string().empty(""),
  });
  validateRequest(req, next, schema);
}

function revokeToken(req, res, next) {
  // accept token from request body or cookie
  const token = req.body.token || req.cookies.refreshToken;
  const ipAddress = req.ip;

  if (!token) return res.status(400).json({ message: "Token is required" });

  // users can revoke their own tokens and admins can revoke any tokens
  if (!req.user.ownsToken(token) && req.user.role !== Role.SuperAdmin) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  accountService
    .revokeToken({ token, ipAddress })
    .then(() => {
      // remove refresh token from cookie
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
        sameSite: "None" 
      });
      res.json({ msg: "Token revoked" });
    })
    .catch(next);
}

// function registerSchema(req, res, next) {
//   const schema = Joi.object({
//     firstName: Joi.string().required(),
//     lastName: Joi.string().required(),
//     email: Joi.string().email().required(),
//     password: Joi.string().min(6).required(),
//     confirmPassword: Joi.string().valid(Joi.ref("password")).required(),
//     // role: Joi.string().valid(Role.SuperAdmin, Role.Admin, Role.Teacher, Role.Student).required(),
//   });
//   validateRequest(req, next, schema);
// }

// function register(req, res, next) {
//   accountService
//     .register(req.body, req.get("origin"))
//     .then((_) =>
//       res.json({ msg: "registration succesful, please check your email" })
//     )
//     .catch(next);
// }

function verifyEmailSchema(req, res, next) {
  const schema = Joi.object({
    token: Joi.string().required(),
  });
  validateRequest(req, next, schema);
}

function verifyEmail(req, res, next) {
  accountService
    .verifyEmail(req.body)
    .then((_) => res.json({ msg: "Verification succesful, you can now login" }))
    .catch(next);
}

function forgotPasswordSchema(req, res, next) {
  const schema = Joi.object({
    email: Joi.string().email().required(),
  });
  validateRequest(req, next, schema);
}

function forgotPassword(req, res, next) {
  accountService
    .forgotPassword(req.body, req.get("origin"))
    .then((_) =>
      res.json({
        msg: "Please check your email for password reset instructions",
      })
    )
    .catch(next);
}

function validateResetTokenSchema(req, res, next) {
  const schema = Joi.object({
    email: Joi.string().required(),
  });
  validateRequest(req, next, schema);
}

function validateResetToken(req, res, next) {
  accountService
    .validateResetToken(req.body)
    .then((_) => res.json({ msg: "Token is valid" }))
    .catch(next);
}

function resetPasswordSchema(req, res, next) {
  const schema = Joi.object({
    token: Joi.string().required(),
    password: Joi.string().min(6).required(),
    confirmPassword: Joi.string().valid(Joi.ref("password")).required(),
  });
  validateRequest(req, next, schema);
}

function resetPassword(req, res, next) {
  accountService
    .resetPassword(req.body)
    .then((_) =>
      res.json({ msg: "Password reset successful, you can now login" })
    )
    .catch(next);
}

function getAll(req, res, next) {
  accountService
    .getAll()
    .then((accounts) => res.json(accounts))
    .catch(next);
}

function getById(req, res, next) {
  if (
    Number(req.params.id) !== req.user.id &&
    req.user.role !== Role.SuperAdmin
  ) {
    return res.status(401).json({ msg: "Unauthorized" });
  }

  accountService
    .getById(req.params.id)
    .then((account) => (account ? res.json(account) : res.sendStatus(404)))
    .catch(next);
}

function createSchema(req, res, next) {
  const schema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    confirmPassword: Joi.string().valid(Joi.ref("password")).required(),
    role: Joi.string()
      .valid(Role.SuperAdmin, Role.Registrar, Role.Principal, Role.Teacher)
      .required(),
  });
  validateRequest(req, next, schema);
}

function create(req, res, next) {
  accountService
    .create(req.body)
    .then((account) => res.json(account))
    .catch(next);
}

function updatePasswordSchema(req, res, next) {
  const schemaRules = {
    password: Joi.string().min(6).empty(""),
    confirmPassword: Joi.string().valid(Joi.ref("password")).empty(""),
  };

  const schema = Joi.object(schemaRules).with("password", "confirmPassword");
  validateRequest(req, next, schema);
}

function updatePassword(req, res, next) {
  accountService
    .update(req.params.id, req.body)
    .then((account) => res.json(account))
    .catch(next);
}

function updateSchema(req, res, next) {
  const schemaRules = {
    firstName: Joi.string().empty(""),
    lastName: Joi.string().empty(""),
    email: Joi.string().email().empty(""),
    isActive: Joi.boolean(),
    password: Joi.string().min(6).empty(""),
    confirmPassword: Joi.string().valid(Joi.ref("password")).empty(""),
  };

  // only admins can update role
  if (req.user.role === Role.SuperAdmin) {
    schemaRules.role = Joi.string()
      .valid(
        Role.SuperAdmin,
        Role.Teacher,
        Role.Principal,
        Role.Registrar,
        Role.Student
      )
      .empty("");
  }

  const schema = Joi.object(schemaRules).with("password", "confirmPassword");
  validateRequest(req, next, schema);
}

function update(req, res, next) {
  // users can update their own account and admins can update any account
  if (
    Number(req.params.id) !== req.user.id &&
    req.user.role !== Role.SuperAdmin
  ) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  accountService
    .update(req.params.id, req.body)
    .then((account) => res.json(account))
    .catch(next);
}

function _delete(req, res, next) {
  if (Number(req.params.id) !== req.user.id && req.user.role !== Role.Admin) {
    return res.status(401).json({ msg: "Unauthorized" });
  }

  accountService
    .delete(req.params.id)
    .then((_) => res.json({ msg: "Account deleted successfully" }))
    .catch(next);
}

// helper function

function setTokenCookie(res, token) {
  // create cookie with refresh token that expires in 7 days
  const cookieOptions = {
    httpOnly: true,
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    secure: process.env.NODE_ENV === "production", // true only in prod
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
  };
  res.cookie("refreshToken", token, cookieOptions);
}
