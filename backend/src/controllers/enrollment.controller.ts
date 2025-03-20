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
    const { user_id, role, description } = req.body;

    // ✅ เช็คไฟล์แนบ
    const files = Array.isArray(req.files)
      ? req.files
      : req.files?.licenses as Express.Multer.File[] || [];

    let licensePaths: string[] = [];
    if (files && files.length > 0) {
      licensePaths = files.map(file => file.path.replace(/^.*?uploads\//, ''));
    }
    
    if (licensePaths.length === 0) {
      res.status(400).json({
        success: false,
        message: 'At least one license file is required'
      });
      return;
    }

    // ✅ สร้าง EnrollmentData
    const enrollmentData: Partial<EnrollmentDocument> = {
      user_id: new Types.ObjectId(user_id),
      role,
      description,
      license_files: licensePaths,
      status: EnrollmentStatus.Pending,
      create_at: new Date()
    };
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

// export const updateEnrollmentController = async (
//   req: Request, 
//   res: Response, 
//   next: NextFunction
// ): Promise<void> => {
//   try {
//     const { status } = req.body;
    
//     if (!Object.values(EnrollmentStatus).includes(status)) {
//       res.status(400).json({
//         success: false,
//         message: 'Invalid enrollment status'
//       });
//       return;
//     }

//     const token = req.headers['x-access-token'] as string;
//     const decodedToken = jwtDecode(token) as { _id: string };
//     const reviewerId = decodedToken._id;
    
//     const updatedEnrollment = await EnrollmentService.update(req.params.id, { 
//       status, 
//       updated_at: new Date(),
//       reviewer: new Types.ObjectId(reviewerId) // Correct usage of Types.ObjectId
//     });
    
//     if (!updatedEnrollment) {
//       res.status(404).json({
//         success: false,
//         message: 'Enrollment not found'
//       });
//       return;
//     }
    
//     res.status(200).json({
//       success: true,
//       message: 'Enrollment updated successfully',
//       data: updatedEnrollment
//     });
//   } catch (err) {
//     next(err);
//   }
// };

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