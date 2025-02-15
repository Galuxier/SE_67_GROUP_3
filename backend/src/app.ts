import express, { Application } from 'express';
import bodyParserMiddleware from './middlewares/bodyParser';
import userRoutes from './routes/account';

const app: Application = express();

bodyParserMiddleware(app);

app.use('/api/accounts', userRoutes);

export default app;
