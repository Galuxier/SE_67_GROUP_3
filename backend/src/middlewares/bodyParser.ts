import express from 'express';

// Middleware สำหรับการแปลงข้อมูล JSON และ Form-encoded
const bodyParserMiddleware = (app: express.Application) => {
  // ใช้ middleware สำหรับรับข้อมูลแบบ JSON
  app.use(express.json());

  // ใช้ middleware สำหรับรับข้อมูลแบบ Form-encoded
  app.use(express.urlencoded({ extended: false }));
};

export default bodyParserMiddleware;
