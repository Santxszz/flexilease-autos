import { Like } from "typeorm";

import { getDataSource } from "@database/index";
import Car from "@database/entities/Car";
import getUserTokenInfo from "@api/utils/userTokenGet";
import AppError from "@api/middlewares/AppError";
import User from "@database/entities/User";

export default class ListAllCarService {
	public async execute(
		page: number,
		skip: number,
		take: number,
		search: undefined,
		tokenUser: string,
	) {
		const DataSource = await getDataSource();
		const carRepository = DataSource.getRepository(Car);
		const userRepository = DataSource.getRepository(User);

		const { userId }: any | undefined | string | number =
			await getUserTokenInfo({
				tokenUser,
			});

		const userExists = await userRepository.findOne({
			where: { id: userId },
		});

		if (!userExists) {
			throw new AppError("User is not found", 404);
		}

		if (!page && !take && search) {
			const [cars, count] = await carRepository
				.createQueryBuilder()
				.skip(0)
				.orWhere({ model: search })
				.orWhere({ color: search })
				.orWhere({ year: search })
				.orWhere({ valuePerDay: search })
				.orWhere({ acessories: Like(`%${search}%`) })
				.orWhere({ numberOfPassengers: search })
				.take(10)
				.getManyAndCount();

			let objectCarArray: object[] = [];
			cars.map((item) => {
				let carAcessories: any = [];
				item.acessories.map((x) => {
					carAcessories.push({ name: x });
				});

				const carsObject = {
					id: item.id,
					model: item.model,
					color: item.color,
					year: item.year,
					valuePerDay: item.valuePerDay,
					acessories: carAcessories,
					numberOfPassengers: item.numberOfPassengers,
				};
				objectCarArray.push(carsObject);
			});

			const result = {
				car: objectCarArray,
				total: count,
				limit: 10,
				offset: 1,
				offsets: Math.ceil(count / 10),
			};

			return result;
		}

		if (search) {
			const [cars, count] = await carRepository
				.createQueryBuilder()
				.skip(skip)
				.orWhere({ model: search })
				.orWhere({ color: search })
				.orWhere({ year: search })
				.orWhere({ valuePerDay: search })
				.orWhere({ acessories: Like(`%${search}%`) })
				.orWhere({ numberOfPassengers: search })
				.take(take)
				.getManyAndCount();

			let objectCarArray: object[] = [];
			cars.map((item) => {
				let carAcessories: any = [];
				item.acessories.map((x) => {
					carAcessories.push({ name: x });
				});

				const carsObject = {
					id: item.id,
					model: item.model,
					color: item.color,
					year: item.year,
					valuePerDay: item.valuePerDay,
					acessories: carAcessories,
					numberOfPassengers: item.numberOfPassengers,
				};
				objectCarArray.push(carsObject);
			});

			const result = {
				car: objectCarArray,
				total: count,
				limit: take,
				offset: page,
				offsets: Math.ceil(count / take),
			};

			return result;
		}

		const [cars, count] = await carRepository
			.createQueryBuilder()
			.skip(skip ? skip : 0)
			.take(take ? take : 10)
			.getManyAndCount();

		let objectCarArray: object[] = [];
		cars.map((item) => {
			let carAcessories: any = [];
			item.acessories.map((x) => {
				carAcessories.push({ name: x });
			});

			const carsObject = {
				id: item.id,
				model: item.model,
				color: item.color,
				year: item.year,
				valuePerDay: item.valuePerDay,
				acessories: carAcessories,
				numberOfPassengers: item.numberOfPassengers,
			};
			objectCarArray.push(carsObject);
		});

		const result = {
			car: objectCarArray,
			total: count,
			limit: take ? take : 10,
			offset: page ? page : 1,
			offsets: take ? Math.ceil(count / take) : Math.ceil(count / 10),
		};

		return result;
	}
}
