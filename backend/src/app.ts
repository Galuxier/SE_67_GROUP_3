import express, { Application } from 'express';
import bodyParserMiddleware from './middlewares/bodyParser';
import userRoutes from './routes/user.route';
import adsPackageRoutes from './routes/adsPackage.route';
import shopRoutes from './routes/shop.route';
import gymRoutes from './routes/gym.route';

const app: Application = express();

bodyParserMiddleware(app);

app.use('/api', userRoutes);
app.use('/api', adsPackageRoutes);
app.use('/api', shopRoutes);
app.use('/api', gymRoutes);

export default app;
