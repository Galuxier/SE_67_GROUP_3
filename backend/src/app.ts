import express, { Application } from 'express';
import bodyParserMiddleware from './middlewares/bodyParser';
import userRoutes from './routes/user.route';
import adsPackageRoutes from './routes/adsPackage.route';
import shopRoutes from './routes/shop.route';
import gymRoutes from './routes/gym.route';
import fightHistoryRoutes from './routes/fightHistory.route';
import notificationRoutes from './routes/notification.route';
import courseRoutes from './routes/course.route';

const app: Application = express();

bodyParserMiddleware(app);

app.use('/api', userRoutes);
app.use('/api', adsPackageRoutes);
app.use('/api', shopRoutes);
app.use('/api', gymRoutes);
app.use('/api', fightHistoryRoutes);
app.use('/api', notificationRoutes);
app.use('/api', courseRoutes);


export default app;
