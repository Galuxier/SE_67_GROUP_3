// src/services/ownPackage.service.ts
import { OwnPackage, OwnPackageDocument, OwnPackageStatus, OwnPackageType } from '../models/ownPackage.model';
import { AdsPackageModel } from '../models/adsPackage.model';
import { Order, OrderType } from '../models/order.model';
import { BaseService } from './base.service';
import { Types } from 'mongoose';

class OwnPackageService extends BaseService<OwnPackageDocument> {
  constructor() {
    super(OwnPackage);
  }

  /**
   * Create own package records from a paid order
   * @param orderId Order ID to process
   * @returns Array of created OwnPackage documents
   */
  async createFromOrder(orderId: string): Promise<OwnPackageDocument[]> {
    try {
      // Find the order
      const order = await Order.findById(orderId);
      
      if (!order) {
        throw new Error(`Order not found: ${orderId}`);
      }
      
      // Check if this is an ads package order
      if (order.order_type !== OrderType.AdsPackage) {
        throw new Error(`Order is not an ads package order: ${orderId}`);
      }
      
      const ownPackages: OwnPackageDocument[] = [];
      
      // Process each item in the order
      for (const item of order.items) {
        // Get the package details to determine duration and type
        const adsPackage = await AdsPackageModel.findById(item.ref_id);
        
        if (!adsPackage) {
          console.warn(`Ad package not found for item in order ${orderId}, item ref_id: ${item.ref_id}`);
          continue;
        }
        
        // Calculate expiry date based on package duration (in days)
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + adsPackage.duration);
        
        // Create own package for each quantity purchased
        for (let i = 0; i < item.quantity; i++) {
          const ownPackage = new OwnPackage({
            user_id: order.user_id,
            package_id: item.ref_id,
            order_id: order._id,
            type: adsPackage.type, // Get the type from the package
            status: OwnPackageStatus.Active,
            expiry_date: expiryDate,
            purchased_at: new Date()
          });
          
          await ownPackage.save();
          ownPackages.push(ownPackage);
        }
      }
      
      return ownPackages;
    } catch (error) {
      console.error('Error creating own packages from order:', error);
      throw error;
    }
  }
  
  /**
   * Get user's active packages by type
   * @param userId User ID
   * @param type Package type (course or event)
   * @returns Array of active packages
   */
  async getUserActivePackages(userId: string, type?: OwnPackageType): Promise<OwnPackageDocument[]> {
    try {
      const query: any = {
        user_id: new Types.ObjectId(userId),
        status: OwnPackageStatus.Active,
        expiry_date: { $gt: new Date() } // Not expired
      };
      
      if (type) {
        query.type = type;
      }
      
      return await OwnPackage.find(query)
        .populate('package_id')
        .sort({ expiry_date: 1 });
    } catch (error) {
      console.error('Error fetching user active packages:', error);
      throw error;
    }
  }
  
  /**
   * Mark a package as used by linking it to a course or event
   * @param packageId Package ID to mark as used
   * @param refId Reference ID of the course or event
   * @returns Updated package document
   */
  async usePackage(packageId: string, refId: string): Promise<OwnPackageDocument | null> {
    try {
      const ownPackage = await OwnPackage.findById(packageId);
      
      if (!ownPackage) {
        throw new Error(`Package not found: ${packageId}`);
      }
      
      if (ownPackage.status !== OwnPackageStatus.Active) {
        throw new Error(`Package is not active: ${packageId}`);
      }
      
      if (ownPackage.expiry_date < new Date()) {
        throw new Error(`Package has expired: ${packageId}`);
      }
      
      // Update the package to used status
      ownPackage.status = OwnPackageStatus.Used;
      ownPackage.used_at = new Date();
      ownPackage.ref_id = new Types.ObjectId(refId);
      
      await ownPackage.save();
      return ownPackage;
    } catch (error) {
      console.error('Error using package:', error);
      throw error;
    }
  }
  
  /**
   * Process expired packages (updates status to expired)
   * @returns Number of packages updated
   */
  async processExpiredPackages(): Promise<number> {
    try {
      const result = await OwnPackage.updateMany(
        {
          status: OwnPackageStatus.Active,
          expiry_date: { $lt: new Date() }
        },
        {
          status: OwnPackageStatus.Expired
        }
      );
      
      return result.modifiedCount || 0;
    } catch (error) {
      console.error('Error processing expired packages:', error);
      throw error;
    }
  }
}

export default new OwnPackageService();