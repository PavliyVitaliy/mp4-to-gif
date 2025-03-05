import cors from 'cors';
import express, { Request, Response } from 'express';
import { router as uploadRouter } from './routes/uploadRoute';
import { router as downloadRouter } from './routes/downloadRoute';
import { setupSwagger } from './config/swagger';

const app = express();
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
}));
app.use(express.json());

setupSwagger(app);

app.use('/api', uploadRouter);
app.use('/api', downloadRouter);

app.get('/', (req: Request, res: Response) => {
    res.send('MP4 to GIF Converter API is running');
});

export default app;
