import express, { Application } from 'express';
import bodyParserMiddleware from './middlewares/bodyParser';
import userRoutes from './routes/user.route';

const app: Application = express();

bodyParserMiddleware(app);

app.use('/api', userRoutes);

export default app;
