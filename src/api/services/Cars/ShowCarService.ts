import { AppDataSource } from "@database/index";
import AppError from "@api/middlewares/AppError";
import Car from "@database/entities/Car";

export default class ShowCarService {
	public async execute(id: number) {
		const carRepository = AppDataSource.getRepository(Car);
		const showCar = await carRepository.findOne({ where: { id } });
		if (!showCar) {
			throw new AppError("Car not found", 404);
		}

		const acessoriesList: { name: string }[] = [];
		showCar.acessories.map((item) => {
			acessoriesList.push({ name: item });
		});

		const resultObjectCar = {
			id: showCar.id,
			model: showCar.model,
			color: showCar.color,
			year: showCar.year,
			valuePerDay: showCar.valuePerDay,
			acessories: acessoriesList,
			numberOfPassengers: showCar.numberOfPassengers,
		};

		return resultObjectCar;
	}
}
