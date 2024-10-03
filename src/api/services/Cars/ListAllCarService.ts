import { AppDataSource } from "@database/index";
import AppError from "@api/middlewares/AppError";
import Car from "@database/entities/Car";

export default class ListAllCarService {
	public async execute(
		page: number,
		skip: number,
		take: number,
		search: undefined,
	) {
		const carRepository = AppDataSource.getRepository(Car);

		if (!page && !take && search) {
			const [cars, count] = await carRepository
            .createQueryBuilder()
            .skip(0)
            .orWhere({ model: search })
            .orWhere({ color: search })
            .orWhere({ year: search })
            .orWhere({ valuePerDay: search })
            .orWhere({ acessories: search })
            .orWhere({ numberOfPassengers: search })

            .take(10)
            .getManyAndCount();

			const result = {
				car: cars,
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
				.orWhere({ acessories: search })
				.orWhere({ numberOfPassengers: search })

				.take(take)
				.getManyAndCount();

			const result = {
				car: cars,
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

		// console.log(cars.length);
		// cars.map((item) => {
		// 	console.log(item.model);
		// });

		const result = {
			car: cars,
			total: count,
			limit: take ? take : 10,
			offset: page ? page : 1,
			offsets: take ? Math.ceil(count / take) : Math.ceil(count / 10),
		};

		return result;
	}
}
