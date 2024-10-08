import "reflect-metadata";
import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
	type: "sqlite",
	database: "flexilease.db",
	synchronize: true,
	logging: false,
	migrations: ["src/database/migrations/**.ts"],
	entities: ["src/database/entities/**.ts"],
	migrationsTableName: "_migrations",
	migrationsRun: true,
});

AppDataSource.initialize()
	.then(() => {
		console.log("DB Connected");
	})
	.catch((error) => {
		throw new Error(error);
	});

export const getDataSource = (delay = 3000): Promise<DataSource> => {
	if (AppDataSource.isInitialized) return Promise.resolve(AppDataSource);

	return new Promise((resolve, reject) => {
		setTimeout(() => {
			if (AppDataSource.isInitialized) resolve(AppDataSource);
			else reject("Failed to create connection with database");
		}, delay);
	});
};
