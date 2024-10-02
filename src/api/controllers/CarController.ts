import axios from "axios";
import jwt from "jsonwebtoken";
import type { Request, Response } from "express";
import { instanceToInstance } from "class-transformer";
import CreateCarService from "@api/services/Cars/CreateCarService";



export default class CarController {
	public async create(req: Request, res: Response): Promise<Response> {
		const { model, color, year, valuePerDay, acessories, numberOfPassengers } =
			req.body;

        const carService = new CreateCarService()
        
        const createCar = await carService.execute({model, color, year, valuePerDay, acessories, numberOfPassengers})
        return res.status(201).json(createCar)
	}
}
