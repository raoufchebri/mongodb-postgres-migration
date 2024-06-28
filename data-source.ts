import { DataSource } from 'typeorm';
import { User } from './entities/User'; // Adjust the import path as needed

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.POSTGRESQL_URI,
  synchronize: true,
  logging: true,
  entities: [User], // Add your entities here
  migrations: [],
  subscribers: [],
});

AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
  })
  .catch((err) => {
    console.error('Error during Data Source initialization:', err);
  });
