import type { Request, Response, NextFunction } from "express";
import jwtToken from "jsonwebtoken";
import AppError from "./AppError";

export default async function authenticateToken(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	const jwt = req.headers.authorization;
	if (!jwt) {
		return res.status(401).json({ Erro: "Falta o Token" });
	}
	jwtToken.verify(
		String(jwt),
		process.env.JWT_SECRET as string,
		(err, userInfo) => {
			if (err) {
				throw new AppError('Token provided is invalid!', 403, 'Forbidden')
			}
			console.log(userInfo);
			res.status(200).json({
				"Boas-Vindas": userInfo,
			});
			next();
		},
	);
}
