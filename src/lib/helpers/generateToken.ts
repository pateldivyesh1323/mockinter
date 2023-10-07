import * as jose from "jose"

const signature = new TextEncoder().encode(process.env.JWT_SECRET);

const generateToken = async (id: string) => {
  return await new jose.SignJWT({ id }).setProtectedHeader({ alg: "HS256" }).setExpirationTime("30d").sign(signature);
};

export default generateToken;
