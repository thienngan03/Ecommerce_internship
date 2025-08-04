const bcrypt = require('bcrypt');
const Account = require('../models/Account.js');
const Buyer = require('../models/Buyer.js');
const Cart = require('../models/Cart.js');
const Order = require('../models/Order.js');
const OrderDetail = require('../models/OrderDetail.js');
const Seller = require('../models/Seller.js');
const Product = require('../models/Product.js');
const Category = require('../models/Category.js');
const ProductCategory = require('../models/ProductCategory.js');
const Shop = require('../models/aShop.js');

const sequelize = require('./dbConfig');
const e = require('express');

const NUM_TOTAL_USERS = 100;
const NUM_BUYER_SELLERS = 50; // out of 94 buyers

const DEFAULT_PASSWORD = 'password';
const DEFAULT_AVATAR = 'https://icons.veryicon.com/png/o/miscellaneous/rookie-official-icon-gallery/225-default-avatar.png';
const DEFAULT_BACKGROUND = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-980350_1280.png';

const createUsers = async () => {
  const t = await sequelize.transaction();
  try {
    // const roles = ['buyer', 'seller'];
    
     let userId = 1;

    // === Create 50 Buyers ===
    for (let i = 1; i <= NUM_BUYER_SELLERS; i++) {
        const user = await Account.create({
            email: `user${userId}@gmail.com`,
            password: DEFAULT_PASSWORD,
            role: 'buyer',
        }, { transaction: t });
        await Buyer.create({
            accountId: user.id,
            name: `buyer_${userId}`,
            phone: `012345678${i}`,
            address: `Address ${i}`,
            avatarUrl: DEFAULT_AVATAR,
        }, { transaction: t });

      userId++;
    }

    // === Create remaining 50 seller  ===
    for (let i = 1; i <= 50; i++) {
      const user = await Account.create({
        email: `user${userId}@gmail.com`,
        password: DEFAULT_PASSWORD,
        role: 'seller',
      }, { transaction: t });

        await Seller.create({
            accountId: user.id,
            name: `seller_${userId}`,
            phone: `098765432${i}`,
            address: `Address ${i}`,
            avatarUrl: DEFAULT_AVATAR,
        }, { transaction: t });


          await Shop.create({
        accountId: user.id,
        name: `Shop_${userId}`,
        phone: `123456789${userId}`,
        address: `Shop address for user ${userId}`,
        email: `shop${userId}@gmail.com`,
        description: `Shop description for user ${userId}`,
        avatarUrl: DEFAULT_AVATAR,
    } , { transaction: t });
      userId++;
    }

    await t.commit();
    console.log('✅ 100 users created successfully');
  } catch (error) {
    await t.rollback();
    console.error('❌ Error creating users:', error);
  } finally {
    await sequelize.close();
  }
};

const updateDefaultPassword = async () => {
  const t = await sequelize.transaction();
  try {
    const accounts = await Account.findAll({ transaction: t });
    const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, 10);
    for (const account of accounts) {
      account.password = hashedPassword; // Set to default password
      await account.save({ transaction: t });
    }

    await t.commit();
    console.log('✅ Default password updated successfully');
  } catch (error) {
    await t.rollback();
    console.error('❌ Error updating default password:', error);
  } finally {
    await sequelize.close();
  }
}
// updateDefaultPassword();

createUsers();
