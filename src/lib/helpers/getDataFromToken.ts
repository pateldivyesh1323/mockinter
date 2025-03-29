import * as jose from "jose";
import { NextRequest } from "next/server";
import { AUTH_TOKEN_KEY } from "@/src/constants";

export const getDataFromToken = async (req: NextRequest) => {
    try {
        const token = req.cookies.get(AUTH_TOKEN_KEY)?.value || "";
        const signature = new TextEncoder().encode(process.env.JWT_SECRET);
        const decodedToken = await jose.jwtVerify(token, signature);
        return decodedToken.payload.id;
    } catch (error: any) {
        throw new Error(error.message);
    }
};
