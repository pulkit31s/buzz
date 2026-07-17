import jwt, { SignOptions } from "jsonwebtoken";
import { User, IUserDocument, ANONYMOUS_NAMES } from "../users/user.model";
import { RegisterInput, LoginInput } from "./auth.validation";
import { ApiError } from "../../utils/ApiError";
import { env } from "../../config/env";

/**
 * Generates an access token and an optional refresh token for a given user ID.
 */
export const generateTokens = (userId: string) => {
  const signOptions: SignOptions = {
    expiresIn: env.JWT_EXPIRES_IN as SignOptions["expiresIn"],
  };

  const accessToken = jwt.sign({ userId }, env.JWT_SECRET, signOptions);

  const refreshToken = jwt.sign({ userId, type: "refresh" }, env.JWT_SECRET, {
    expiresIn: "30d",
  });

  return { accessToken, refreshToken };
};

/**
 * Service: Register a new campus user
 * Automatically assigns one of the 4 Anonymous Animal identities (`Anonymous Fox`, `Owl`, `Panda`, `Tiger`).
 */
export const registerService = async (payload: RegisterInput) => {
  // 1. Check if email, username, or collegeId already exists
  const existingUser = await User.findOne({
    $or: [
      { email: payload.email },
      { username: payload.username },
      { collegeId: payload.collegeId },
    ],
  });

  if (existingUser) {
    if (existingUser.email === payload.email) {
      throw new ApiError(409, "A user with this email already exists");
    }
    if (existingUser.username === payload.username) {
      throw new ApiError(409, "This username is already taken");
    }
    if (existingUser.collegeId === payload.collegeId) {
      throw new ApiError(409, "This College ID is already registered");
    }
  }

  // 2. Automatically generate anonymous identity
  const randomIndex = Math.floor(Math.random() * ANONYMOUS_NAMES.length);
  const anonymousName = ANONYMOUS_NAMES[randomIndex];

  // Generate clean deterministic or avatar URL corresponding to the animal
  const animalSeed = anonymousName.split(" ")[1].toLowerCase(); // fox, owl, panda, tiger
  const anonymousAvatar = `https://api.dicebear.com/7.x/bottts/svg?seed=${animalSeed}`;

  // 3. Create user in MongoDB (password will be automatically hashed by pre-save hook)
  const user = await User.create({
    ...payload,
    anonymousName,
    anonymousAvatar,
    verified: false,
  });

  // 4. Generate JWT tokens
  const tokens = generateTokens(user._id.toString());

  return { user, ...tokens };
};

/**
 * Service: Authenticate user login via email and password
 */
export const loginService = async (payload: LoginInput) => {
  // 1. Find user by email and explicitly select password field
  const user = await User.findOne({ email: payload.email }).select("+password");

  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  // 2. Compare candidate password with stored bcrypt hash
  const isPasswordMatch = await user.comparePassword(payload.password);
  if (!isPasswordMatch) {
    throw new ApiError(401, "Invalid email or password");
  }

  // 3. Generate JWT tokens
  const tokens = generateTokens(user._id.toString());

  // 4. Convert user to JSON (strips password field cleanly via schema toJSON transform)
  const userObj = user.toJSON();

  return { user: userObj, ...tokens };
};
