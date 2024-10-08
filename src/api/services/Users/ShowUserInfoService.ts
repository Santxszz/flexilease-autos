import dayjs from "dayjs";

import { getDataSource } from "@database/index";
import User from "@database/entities/User";

import AppError from "@api/middlewares/AppError";

interface IParams {
	id: number;
}

export default class ShowUserInfoService {
	public async execute({ id }: IParams) {
		const DataSource = await getDataSource();
		const userRepository = await DataSource.getRepository(User);

		const userShow = await userRepository.findOne({
			where: { id },
		});

		if (!userShow) {
			throw new AppError("User not found.", 404);
		}

		const userObjectResponse = {
			id: userShow.id,
			name: userShow.name,
			cpf: userShow.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4"),
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
