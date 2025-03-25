import express, { Application } from 'express';
import bodyParserMiddleware from './middlewares/bodyParser';
import userRoutes from './routes/user.routes';
import adsPackageRoutes from './routes/adsPackage.routes';
import shopRoutes from './routes/shop.routes';
import gymRoutes from './routes/gym.routes';
import fightHistoryRoutes from './routes/fightHistory.routes';
import notificationRoutes from './routes/notification.routes';
import courseRoutes from './routes/course.routes';
import cartRoutes from './routes/cart.routes';
import eventRoutes from './routes/event.routes';
import locationRoutes from './routes/location.routes';
import orderRoutes from './routes/order.routes';
import paymentRoutes from './routes/payment.routes';
import productRoutes from './routes/product.routes';
import recommendRoutes from './routes/recommend.routes';
import teachHistoryRoutes from './routes/teachHistory.routes';
import ticketRoutes from './routes/ticket.routes';
import authRoutes from './routes/auth.routes';
import imageRoutes from './routes/image.routes';
import enrollmentRoutes from './routes/enrollment.routes';
import variantRoutes from './routes/variant.routes';

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
app.use('/api', imageRoutes);
app.use('/api', enrollmentRoutes);
app.use('/api', variantRoutes);

import { testUpload, testMultiUpload } from './middlewares/uploads/test.upload';
app.post('/test/single', testUpload, (req, res) => {
    console.log(req.files); // ควรตรวจสอบว่าไฟล์ถูกส่งมาถูกต้องหรือไม่
    res.json({ message: 'Files uploaded successfully' });
});

app.post('/test/multi', testMultiUpload, (req, res) => {
    console.log('Multi Images:', req.body);
    res.json({ message: req.body });
});


export default app;
