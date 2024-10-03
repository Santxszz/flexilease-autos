import { AppDataSource } from "@database/index";
import AppError from "@api/middlewares/AppError";
import Car from "@database/entities/Car";
import type InterfaceRequestCarUpdate from "@api/interfaces/InterfaceRequestCarUpdate";

export default class UpdateCarService {
	public async execute({
		model,
		color,
		year,
		valuePerDay,
		acessories,
		numberOfPassengers,
		id,
	}: InterfaceRequestCarUpdate) {
		const carRepository = AppDataSource.getRepository(Car);

		const updateCar = await carRepository.findOne({ where: { id } });
		if (!updateCar) {
			throw new AppError("Car not found", 404);
		}

		const acessoriesArray: any[] = [];
		acessories?.map((item: any) => {
			acessoriesArray.push(item.name);
			console.log(item.name);
		});

		if (Number(year) < 1950 || Number(year) > 2023) {
			throw new AppError(
				"The year of vehicle is invalid, must be between 1930-2023!",
			);
		}

		if (updateCar.acessories.length < 1) {
			throw new AppError("Requires at least one accessory!");
		}

		updateCar.model = model ? model : updateCar.model;
		updateCar.color = color ? color : updateCar.color;
		updateCar.year = year ? year : updateCar.year;
		updateCar.valuePerDay = valuePerDay ? valuePerDay : updateCar.valuePerDay;
		updateCar.acessories = acessories ? acessoriesArray : updateCar.acessories;
		updateCar.numberOfPassengers = numberOfPassengers
			? numberOfPassengers
			: updateCar.numberOfPassengers;

		await carRepository.save(updateCar);

		const resultObjectCar = {
			id: updateCar.id,
			model: updateCar.model,
			color: updateCar.color,
			year: updateCar.year,
			valuePerDay: updateCar.valuePerDay,
			acessories: acessories,
			numberOfPassengers: updateCar.numberOfPassengers,
		};

		return resultObjectCar;
	}
}
