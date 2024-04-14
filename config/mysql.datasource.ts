import { DataSourceOptions, DataSource } from "typeorm";

// TODO: remove the credentials from the code and use environment variables
export const mysqlDataSourceOptions: DataSourceOptions = {
    type: "mysql",
    host: "edu-rpa-db-dev.cahnyqo389dg.ap-southeast-2.rds.amazonaws.com",
    port: 3306,
    username: "admin",
    password: "mg5ewMmCuKH9VdSJ9Kgy",
    database: "core",
    synchronize: false,
    migrations: ["dist/migrations/*.js"],
    entities: ["dist/**/{user,notification}.entity{.ts,.js}"],
    // NOTE: the following line will migrate and sync all entities. But it may cause data loss.
    // entities: ["dist/**/*.entity{.ts,.js}"],
};

export const mysqlDataSource = new DataSource(mysqlDataSourceOptions);