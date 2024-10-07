import express from "express";
import { celebrate, Segments } from "celebrate";

import BaseJoi, { type Extension, type Root } from "joi";
import joiDate from "@joi/date";
import UserController from "@api/controllers/UserController";
import authenticateToken from "@api/middlewares/Authenticated";
// import checkUserAuth from "@api/middlewares/CheckUserAuth";
const Joi = BaseJoi.extend(joiDate as unknown as Extension) as Root;

const userRoutes = express.Router();

const userController = new UserController();

// Create a new user
userRoutes.post(
	"/user",
	celebrate({
		[Segments.BODY]: {
			name: Joi.string().required(),
			cpf: Joi.string().required(),
			birth: Joi.date().format("DD/MM/YYYY").required(),
			cep: Joi.string().required(),
			email: Joi.string().email().required(),
			password: Joi.string().required(),
		},
	}),
	userController.create,
);

// Auth a user
userRoutes.post(
	"/auth",
	celebrate({
		[Segments.BODY]: {
			email: Joi.string().email().required(),
			password: Joi.string().required(),
		},
	}),
	userController.auth,
);

// Update User Informations
userRoutes.put(
	"/user/",
	celebrate({
		[Segments.BODY]: {
			name: Joi.string().optional(),
			cpf: Joi.string().optional(),
			birth: Joi.date().format("DD/MM/YYYY").optional(),
			cep: Joi.string().optional(),
			email: Joi.string().email().optional(),
			password: Joi.string().optional(),
		},
	}),
	authenticateToken,
	userController.update,
);

// Delete a specific user
userRoutes.delete(
	"/user/:id",
	celebrate({
		[Segments.PARAMS]: {
			id: Joi.number().required(),
		},
	}),
	authenticateToken,
	userController.delete,
);

// Show a specific user
userRoutes.get(
	"/user",
	authenticateToken,
	userController.show,
);

export default userRoutes;
