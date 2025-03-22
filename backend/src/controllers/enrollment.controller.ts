import { Request, Response, NextFunction } from 'express';
import mongoose, { Schema, Types } from 'mongoose'; // Ensure correct import
import EnrollmentService from '../services/enrollment.service';
import { Enrollment, EnrollmentDocument } from '../models/enrollment.model';
import { EnrollmentStatus } from '../models/enrollment.model';
import { jwtDecode } from 'jwt-decode';

export const createEnrollmentController = async (
  req: Request, 
  res: Response, 
  next: NextFunction
): Promise<void> => {
  try {
    console.log('Request body:', req.body);
    const enrollmentData = req.body;


    console.log(enrollmentData);

    // ✅ บันทึกลง database
    const enrollment = await EnrollmentService.add(enrollmentData);

    res.status(201).json({
      success: true,
      message: 'Enrollment request created successfully',
      data: enrollment
    });
  } catch (err) {
    next(err);
  }
};

export const updateEnrollmentController = async (
  req: Request, 
  res: Response, 
  next: NextFunction
): Promise<void> => {
  try {
    const { status, reviewer_id, reject_reason } = req.body;

    console.log("Req body: ", req.body);
    

    // ✅ ตรวจสอบค่า status ว่าเป็นค่า valid หรือไม่
    if (!Object.values(EnrollmentStatus).includes(status)) {
      res.status(400).json({
        success: false,
        message: 'Invalid enrollment status'
      });
      return;
    }

    // ✅ ตรวจสอบค่า reviewer_id ว่ามีหรือไม่
    if (!reviewer_id) {
      res.status(400).json({
        success: false,
        message: 'Reviewer ID is required'
      });
      return;
    }

    const updateData: any = {
      status,
      updated_at: new Date(),
      reviewer_id: reviewer_id // ✅ ใช้ reviewer_id ที่ส่งมาจาก FormData
    };

    // ✅ เพิ่ม reject_reason กรณีที่ status เป็น rejected
    if (status === 'rejected' && reject_reason) {
      updateData.reject_reason = reject_reason;
    }

    const updatedEnrollment = await EnrollmentService.updateEnrollment(req.params.id, updateData);

    if (!updatedEnrollment) {
      res.status(404).json({
        success: false,
        message: 'Enrollment not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Enrollment updated successfully',
      data: updatedEnrollment
    });
  } catch (err) {
    next(err);
  }
};

export const getEnrollmentsController = async (
  req: Request, 
  res: Response, 
  next: NextFunction
) => {
  try {
    const enrollments = await EnrollmentService.getAllEnrollment();
    res.status(200).json(enrollments);
  } catch (err) {
    next(err);
  }
};

export const getEnrollmentByIdController = async (
  req: Request, 
  res: Response, 
  next: NextFunction
) => {
  try {
    const enrollment = await EnrollmentService.getById(req.params.id);
    if (!enrollment) {
      res.status(404).json({ message: 'Enrollment not found' });
      return;
    }
    res.status(200).json(enrollment);
  } catch (err) {
    next(err);
  }
};

export const getEnrollmentsByUserIdController = async (
  req: Request, 
  res: Response, 
  next: NextFunction
) => {
  try {
    const userId = req.params.userId;
    
    // Convert userId to ObjectId for querying
    const userObjectId = new Types.ObjectId(userId); // Correct usage of Types.ObjectId
    
    // Use Mongoose find method to get enrollments by user ID
    const userEnrollments = await Enrollment.find({ user_id: userObjectId });
    
    res.status(200).json(userEnrollments);
  } catch (err) {
    next(err);
  }
};