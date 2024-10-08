import AppError from "@api/middlewares/AppError";
import jwtToken from "jsonwebtoken"

interface ITokenValidate {
    tokenUser: string;
    // userId: number;
}


export default async function getUserTokenInfo({tokenUser}: ITokenValidate) {
    const jwt = tokenUser;
	const bearerToken = jwt?.split(" ")[1];
	if (!jwt) {
		throw new AppError("Token's not informed!", 404);
	}

    const returnJwt = jwtToken.verify(bearerToken, process.env.JWT_SECRET as string)
    return returnJwt
}
