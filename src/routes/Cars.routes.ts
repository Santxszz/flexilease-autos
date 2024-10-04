import express from "express";
import { celebrate, Segments } from "celebrate";

import BaseJoi, { type Extension, type Root } from "joi";
import joiDate from "@joi/date";
import authenticateToken from "@api/middlewares/Authenticated";
import CarController from "@api/controllers/CarController";
const Joi = BaseJoi.extend(joiDate as unknown as Extension) as Root;

const carRoutes = express.Router();

const carController = new CarController();

// Create a new car
carRoutes.post(
	"/car",
	celebrate({
		[Segments.BODY]: {
			model: Joi.string().required(),
			color: Joi.string().required(),
			year: Joi.number().required(),
			valuePerDay: Joi.number().required().min(1),
			acessories: Joi.array().unique().required(),
			numberOfPassengers: Joi.number().required().min(1),
		},
	}),
	authenticateToken,
	carController.create,
);

// List all cars
carRoutes.get(
	"/car",
	celebrate({
		[Segments.QUERY]: {
			page: Joi.number().min(1).optional(),
			limit: Joi.number().min(1).optional(),
			model: Joi.string().optional(),
			color: Joi.string().optional(),
			year: Joi.number().optional(),
			valuePerDay: Joi.number().optional().min(1),
			acessories: Joi.array().unique().optional(),
			numberOfPassengers: Joi.number().optional().min(1),
		},
	}),
	authenticateToken,
	carController.listAll,
);

// Delete a specific car
carRoutes.delete(
	"/car/:id",
	celebrate({
		[Segments.PARAMS]: {
			id: Joi.number().required(),
		},
	}),
	authenticateToken,
	carController.delete,
);

// Updated a specific car
carRoutes.put(
	"/car/:id",
	celebrate({
		[Segments.BODY]: {
			model: Joi.string().optional(),
			color: Joi.string().optional(),
			year: Joi.number().optional(),
			valuePerDay: Joi.number().optional().min(1),
			acessories: Joi.array().unique().optional(),
			numberOfPassengers: Joi.number().optional().min(1),
		},
	}),
	authenticateToken,
	carController.update,
);

// Show a specific car
carRoutes.get(
	"/car/:id",
	celebrate({
		[Segments.PARAMS]: {
			id: Joi.number().min(1).required(),
		},
	}),
    authenticateToken,
    carController.show
);

// Modify a specific car
carRoutes.patch(
	"/car/:id",
	celebrate({
		[Segments.PARAMS]: {
			id: Joi.number().min(1).required(),
		},
        [Segments.BODY]: {
			model: Joi.string().optional(),
			color: Joi.string().optional(),
			year: Joi.number().optional(),
			valuePerDay: Joi.number().optional().min(1),
			acessories: Joi.array().unique().required(),
			numberOfPassengers: Joi.number().optional().min(1),
		}
	}),
    authenticateToken,
    carController.modify
);


export default carRoutes;
