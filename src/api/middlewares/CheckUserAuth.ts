import type { NextFunction, Response, Request } from "express";
import jwt from "jsonwebtoken";
import AppError from "./AppError";
import type JwtPayload from "@api/interfaces/InterfaceJwtPayload";

export default async function checkUserAuth(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	const userToken = req.headers.authorization;
	const bearerToken = userToken?.split(" ")[1];
	const userId = Number(req.params.id);

	await jwt.verify(
		bearerToken as string,
		process.env.JWT_SECRET as string,
		(err, userInfo) => {
			if (err) {
				throw new AppError("Token is Invalid", 400);
			}
			const tokenPayload = userInfo as JwtPayload;
			if (tokenPayload.userId !== userId) {
				throw new AppError("Not Authorized.", 401);
			}
		},
	);
	next();
}
