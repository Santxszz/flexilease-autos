import type { Request, Response, NextFunction } from "express";
import jwtToken from "jsonwebtoken";
import AppError from "@api/middlewares/AppError";

export default async function authenticateToken(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	const jwt = req.headers.authorization;
	if (!jwt) {
		return res.status(401).json({ Error: "Token is Invalid or Not Provided!" });
	}
	jwtToken.verify(String(jwt), process.env.JWT_SECRET as string, (err) => {
		if (err) {
			throw new AppError("Token provided is invalid!", 403, "Forbidden");
		}
		next();
	});
}
