import dayjs from "dayjs";
import { Equal } from "typeorm";

import { getDataSource } from "@database/index";
import Reserve from "@database/entities/Reserve";
import getUserTokenInfo from "@api/utils/userTokenGet";
import User from "@database/entities/User";
import AppError from "@api/middlewares/AppError";

export default class ListReserveService {
	public async execute(
		page: number,
		skip: number,
		take: number,
		search: undefined,
		tokenUser: string,
	) {
		const DataSource = await getDataSource();
		const reserveRepository = DataSource.getRepository(Reserve);
		const userRepository = DataSource.getRepository(User);

		const { userId }: any | undefined | string | number =
			await getUserTokenInfo({
				tokenUser,
			});

		const userExists = await userRepository.findOne({
			where: { id: userId },
		});

		if (!userExists) {
			throw new AppError("User not found.", 404);
		}

		if (search) {
			const [reserves, count] = await reserveRepository
				.createQueryBuilder("reserves")
				.orWhere({ finalValue: Equal(search), user: userId })
				.orWhere({ car: search, user: userId })
				.leftJoinAndSelect("reserves.user", "user")
				.leftJoinAndSelect("reserves.car", "car")
				.skip(skip ? skip : 0)
				.take(take ? take : 10)
				.getManyAndCount();

			let reserveObject: object[] = [];
			reserves.map((item) => {
				const objectReserves = {
					id: item.id,
					startDate: dayjs(item.startDate).format("DD/MM/YYYY"),
					endDate: dayjs(item.endDate).format("DD/MM/YYYY"),
					finalValue: item.finalValue.toLocaleString("pt-br", {
						style: "currency",
						currency: "BRL",
					}),
					userId: item.user.id,
					carId: item.car.id,
				};
				reserveObject.push(objectReserves);
			});

			const result = {
				reserves: reserveObject,
				total: count,
				limit: take ? take : 10,
				offset: page ? page : 1,
				offsets: take ? Math.ceil(count / take) : Math.ceil(count / 10),
			};

			return result;
		}

		const [reserves, count] = await reserveRepository
			.createQueryBuilder("reserves")
			.leftJoinAndSelect("reserves.user", "user")
			.leftJoinAndSelect("reserves.car", "car")
			.where({ user: userId })
			.skip(skip ? skip : 0)
			.take(take ? take : 10)
			.getManyAndCount();

		let reserveObject: object[] = [];
		reserves.map((item) => {
			const objectReserves = {
				id: item.id,
				startDate: dayjs(item.startDate).format("DD/MM/YYYY"),
				endDate: dayjs(item.endDate).format("DD/MM/YYYY"),
				finalValue: item.finalValue.toLocaleString("pt-br", {
					style: "currency",
					currency: "BRL",
				}),
				userId: item.user.id,
				carId: item.car.id,
			};
			reserveObject.push(objectReserves);
		});

		const result = {
			reserves: reserveObject,
			total: count,
			limit: take ? take : 10,
			offset: page ? page : 1,
			offsets: take ? Math.ceil(count / take) : Math.ceil(count / 10),
		};

		return result;
	}
}
