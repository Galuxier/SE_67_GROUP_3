import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface UserPayload {
    id: string;
    email: string;
    // เพิ่ม properties อื่น ๆ ตามต้องการ
}

declare global {
    namespace Express {
        interface Request {
            user?: UserPayload;
        }
    }
}

const verifyToken = (req: Request, res: Response, next: NextFunction): void => {
    const token = req.body.token || req.query.token || req.headers['x-access-token'];

    if (!token) {
        res.status(403).send('Need token for verify');
        return;
    }

    try {
        const decode = jwt.verify(token, process.env.TOKEN_KEY!) as UserPayload;
        req.user = decode;
        next();
    } catch (err) {
        res.status(401).send("Invalid Token");
        return;
    }
};

export default verifyToken;