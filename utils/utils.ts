import jwt from "jsonwebtoken";

export const JWT_PRIVATE_KEY = "BLOCKPROJECT";

export const createJWT = (user: any) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      time: Date.now(),
    },
    JWT_PRIVATE_KEY,
    {
      expiresIn: "360h",
    }
  );
};



export const validateToken = (token: string) => {
  const user = jwt.verify(token, JWT_PRIVATE_KEY);
  return user;
};

export const normalizeResponse = ({
  data,
  error,
  token,
}: {
  data?: any;
  error?: any;
  token?: string;
}) => ({
  data,
  error,
  token,
  ok: data && !error,
});
