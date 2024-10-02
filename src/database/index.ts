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
    .then(() => {})
    .catch((error) => {throw new Error(error)});
