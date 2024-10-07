import dayjs from "dayjs";

import { getDataSource } from "@database/index";
import User from "@database/entities/User";

import AppError from "@api/middlewares/AppError";
import getUserTokenInfo from "@api/utils/userTokenGet";

interface IToken {
	tokenUser: string;
}

export default class ShowUserInfoService {
	public async execute({ tokenUser }: IToken) {
		const DataSource = await getDataSource();
		const userRepository = await DataSource.getRepository(User);

		const { userId }: any | undefined | string | number =
			await getUserTokenInfo({
				tokenUser,
			});

		const userShow = await userRepository.findOne({
			where: { id: userId },
		});

		if (!userShow) {
			throw new AppError("User not found.", 404);
		}

		const userObjectResponse = {
			id: userShow.id,
			name: userShow.name,
			cpf: userShow.cpf,
			birth: dayjs(userShow.birth).format("DD/MM/YYYY"),
			email: userShow.email,
			qualified: !!userShow.qualified,
			cep: userShow.cep,
			neighbordhood: userShow.neighbordhood,
			street: userShow.street,
			complement: userShow.complement,
			city: userShow.city,
			uf: userShow.uf,
		};

		return userObjectResponse;
	}
}
