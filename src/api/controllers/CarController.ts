import axios from "axios";
import jwt from "jsonwebtoken";
import type { Request, Response } from "express";
import { instanceToInstance } from "class-transformer";
import CreateCarService from "@api/services/Cars/CreateCarService";
import ListAllCarService from "@api/services/Cars/ListAllCarService";
import DeleteCarService from "@api/services/Cars/DeleteCarService";

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
		let search = undefined;
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

		return res.status(200).json(cars);
	}

	public async delete(req: Request, res: Response): Promise<Response> {
		const id = Number.parseInt(req.params.id);
		const carService = new DeleteCarService();
		await carService.execute({ id });
		return res.status(204).json();
	}
}
