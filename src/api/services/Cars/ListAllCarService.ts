import { getDataSource } from "@database/index";
import Car from "@database/entities/Car";

export default class ListAllCarService {
	public async execute(
		page: number,
		skip: number,
		take: number,
		search: undefined,
	) {
		const DataSource = await getDataSource();
		const carRepository = DataSource.getRepository(Car);

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
