import express, { Application } from 'express';
import bodyParserMiddleware from './middlewares/bodyParser';
import userRoutes from './routes/user.route';
import adsPackageRoutes from './routes/adsPackage.route';
import shopRoutes from './routes/shop.route';
import gymRoutes from './routes/gym.route';
import fightHistoryRoutes from './routes/fightHistory.route';
import notificationRoutes from './routes/notification.route';
import courseRoutes from './routes/course.route';
import cartRoutes from './routes/cart.route';
import eventRoutes from './routes/event.route';
import locationRoutes from './routes/location.route';
import orderRoutes from './routes/order.route';
import paymentRoutes from './routes/payment.route';
import productRoutes from './routes/product.route';
import recommendRoutes from './routes/recommend.route';
import teachHistoryRoutes from './routes/teachHistory.route';
import ticketRoutes from './routes/ticket.route';
import authRoutes from './routes/auth.route';

const app: Application = express();

bodyParserMiddleware(app);

app.use('/api', userRoutes);
app.use('/api', adsPackageRoutes);
app.use('/api', shopRoutes);
app.use('/api', gymRoutes);
app.use('/api', fightHistoryRoutes);
app.use('/api', notificationRoutes);
app.use('/api', courseRoutes);
app.use('/api', cartRoutes);
app.use('/api', eventRoutes);
app.use('/api', locationRoutes);
app.use('/api', orderRoutes);
app.use('/api', paymentRoutes);
app.use('/api', productRoutes);
app.use('/api', recommendRoutes);
app.use('/api', teachHistoryRoutes);
app.use('/api', ticketRoutes);
app.use('/api', authRoutes);


export default app;
