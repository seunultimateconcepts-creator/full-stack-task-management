import bcrypt from 'bcrypt';
import jwt, { SignOptions } from 'jsonwebtoken';
import { User, IUser } from '../models/user.model';
import { ConflictError, UnauthorizedError } from '../utils/errors';

interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

interface LoginInput {
  email: string;
  password: string;
}

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

const generateAccessToken = (userId: string, role: string): string => {
  return jwt.sign(
    { id: userId, role },
    process.env.JWT_ACCESS_SECRET as string,
    { expiresIn: process.env.JWT_ACCESS_EXPIRES } as SignOptions
  );
};

const generateRefreshToken = (userId: string): string => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_REFRESH_SECRET as string,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES } as SignOptions
  );
};

export const registerUser = async (input: RegisterInput): Promise<IUser> => {
  const { name, email, password } = input;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ConflictError('Email already registered');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  return user;
};

export const loginUser = async (
  input: LoginInput
): Promise<{ user: IUser; tokens: AuthTokens }> => {
  const { email, password } = input;

  const user = await User.findOne({ email });
  if (!user) {
    throw new UnauthorizedError('Invalid email or password');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new UnauthorizedError('Invalid email or password');
  }

  const accessToken = generateAccessToken(user.id, user.role);
  const refreshToken = generateRefreshToken(user.id);

  user.refreshTokens.push(refreshToken);
  await user.save();

  return { user, tokens: { accessToken, refreshToken } };
};

export const refreshAccessToken = async (token: string): Promise<AuthTokens> => {
  let decoded: { id: string };
  try {
    decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET as string) as { id: string };
  } catch {
    throw new UnauthorizedError('Invalid or expired refresh token');
  }

  const user = await User.findById(decoded.id);
  if (!user || !user.refreshTokens.includes(token)) {
    throw new UnauthorizedError('Invalid refresh token');
  }

  user.refreshTokens = user.refreshTokens.filter((t) => t !== token);
  const newAccessToken = generateAccessToken(user.id, user.role);
  const newRefreshToken = generateRefreshToken(user.id);
  user.refreshTokens.push(newRefreshToken);
  await user.save();

  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
};

export const logoutUser = async (userId: string, token: string): Promise<void> => {
  const user = await User.findById(userId);
  if (!user) return;

  user.refreshTokens = user.refreshTokens.filter((t) => t !== token);
  await user.save();
};