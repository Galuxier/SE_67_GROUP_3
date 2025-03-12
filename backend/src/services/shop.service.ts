import { Shop, ShopDocument } from '../models/shop.model';
import { BaseService } from './base.service';

class ShopService extends BaseService<ShopDocument> {
  constructor() {
    super(Shop); // ส่ง Model ไปยัง BaseService
  }

  // สร้างร้านค้าใหม่
  async createShop(shopData: any, filePaths: string[]) {
    console.log(shopData);
    console.log(filePaths);

    try {
      // แปลง JSON string เป็น object (ถ้าจำเป็น)
      if (typeof shopData.address === 'string') {
        shopData.address = JSON.parse(shopData.address);
      }

      if (typeof shopData.contact === 'string') {
        shopData.contact = JSON.parse(shopData.contact);
      }

      // สร้างร้านค้าใหม่
      const shop = new Shop({
        ...shopData,
        address: shopData.address, // ใส่ address อย่างชัดเจน
        logo_url: filePaths[0] || '', // เก็บ path ของไฟล์โลโก้
        license_url: filePaths[1] || '', // เก็บ path ของไฟล์ใบอนุญาต
      });

      console.log(shop);
      await shop.save();
      return shop;
    } catch (error) {
      console.error("Failed to create shop:", error);
      throw new Error("Failed to create shop");
    }
  }
}

export default new ShopService();