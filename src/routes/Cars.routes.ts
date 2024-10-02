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

export default carRoutes;
