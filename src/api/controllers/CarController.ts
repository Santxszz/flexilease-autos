import type { Request, Response } from "express";
import { instanceToInstance } from "class-transformer";
import CreateCarService from "@api/services/Cars/CreateCarService";
import ListAllCarService from "@api/services/Cars/ListAllCarService";
import DeleteCarService from "@api/services/Cars/DeleteCarService";
import UpdateCarService from "@api/services/Cars/UpdateCarService";
import ShowCarService from "@api/services/Cars/ShowCarService";
import ModifyCarService from "@api/services/Cars/ModifyCarService";

export default class CarController {
	public async create(req: Request, res: Response): Promise<Response> {
		const { model, color, year, valuePerDay, acessories, numberOfPassengers } =
			req.body;

		const carService = new CreateCarService();

		const createCar = await carService.execute({
			model,
			color,
			year,
			valuePerDay,
			acessories,
			numberOfPassengers,
		});
		return res.status(201).json(createCar);
	}

	public async listAll(req: Request, res: Response): Promise<Response> {
		const page = Number(req.query.page);
		const limit = Number(req.query.limit);

		const { model, color, year, valuePerDay, acessories, numberOfPassengers } =
			req.query;
		let search: string | number | string[] | undefined;
		if (model) {
			search = model as string;
		}
		if (year) {
			search = Number(year) as number;
		}
		if (color) {
			search = color as string;
		}
		if (valuePerDay) {
			search = Number(valuePerDay) as number;
		}
		if (acessories) {
			search = acessories as string[];
		}
		if (numberOfPassengers) {
			search = numberOfPassengers as unknown as number;
		}

		const carService = new ListAllCarService();

		const take = limit;
		const skip = (Number(page) - 1) * Number(take);
		const cars = await carService.execute(
			page,
			skip,
			take,
			search as undefined,
		);

		return res.status(200).json(instanceToInstance(cars));
	}

	public async delete(req: Request, res: Response): Promise<Response> {
		const id = Number.parseInt(req.params.id);
		const carService = new DeleteCarService();
		await carService.execute({ id });
		return res.status(204).json();
	}

	public async update(req: Request, res: Response): Promise<Response> {
		const { model, color, year, valuePerDay, acessories, numberOfPassengers } =
			req.body;
		const id = Number(req.params.id);

		const carService = new UpdateCarService();
		const updateCar = await carService.execute({
			model,
			color,
			year,
			valuePerDay,
			acessories,
			numberOfPassengers,
			id,
		});
		return res.status(200).json(updateCar);
	}

	public async show(req: Request, res: Response): Promise<Response> {
		const id = Number(req.params.id);
		const carService = new ShowCarService();
		const showCar = await carService.execute(id);
		return res.status(200).json(showCar);
	}

	public async modify(req: Request, res: Response): Promise<Response> {
		const id = Number.parseInt(req.params.id);
		const { model, color, year, valuePerDay, acessories, numberOfPassengers } =
			req.body;

		const carService = new ModifyCarService();
		const modifyCar = await carService.execute({
			model,
			color,
			year,
			valuePerDay,
			acessories,
			numberOfPassengers,
			id,
		});

		return res.status(200).json(modifyCar);
	}
}
