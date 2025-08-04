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

const categoryNames = [
  'Electronics', 'Smartphones', 'Laptops', 'Tablets', 'Cameras',
  'Televisions', 'Headphones', 'Wearable Tech', 'Gaming Consoles', 'Video Games',
  'Books', 'Stationery', 'Home Decor', 'Furniture', 'Kitchen Appliances',
  'Cookware', 'Bedding & Bath', 'Lighting', 'Tools & Hardware', 'Garden & Outdoor',
  'Clothing - Men', 'Clothing - Women', 'Clothing - Kids', 'Footwear', 'Watches',
  'Jewelry', 'Beauty Products', 'Skincare', 'Hair Care', 'Health & Wellness',
  'Sports Equipment', 'Gym & Fitness', 'Cycling', 'Camping & Hiking', 'Automotive Parts',
  'Car Accessories', 'Pet Supplies', 'Baby Products', 'Toys & Games', 'School Supplies',
  'Office Equipment', 'Groceries', 'Snacks & Beverages', 'Organic Foods', 'Cleaning Supplies',
  'Personal Care', 'Musical Instruments', 'Art & Craft Supplies', 'Collectibles', 'Gift Items'
];


const createCategory = async () =>{
  const t = await sequelize.transaction();
  try {
    const shops = await Shop.findAll({ limit: 50, transaction: t });

    for (const shop of shops) {
      
       const selectedCategories = [...categoryNames].sort(() => 0.5 - Math.random()).slice(0, 10);
      for (const categoryName of selectedCategories) {
        const category = await Category.create({
          shopId: shop.id,
          name: categoryName,
          description: categoryNames[categoryName],
        }, { transaction: t });
      }
        console.log(`✅ Categories created for shop ${shop.id}: ${selectedCategories.join(', ')}`);
      }
    console.log('✅ Categoriescreated successfully.');
          await t.commit();

  } catch (error) {
    await t.rollback();
    console.error('❌ Error creating categories and products:', error);
  } finally {
    await sequelize.close();
  }
}
// Define category-related sample data (for simplicity)
const categoryProductDetails = {
  Electronics: {
    names: ['Smartphone', 'Laptop'],
    descriptions: ['Latest smartphone with advanced features', 'High-performance laptop for gaming and work'],
    priceRange: [300, 2000], // Example: $300 - $2000
    thumbnailURLs: [
      'https://i.pinimg.com/736x/cc/3d/3b/cc3d3bb74f67dc4849f866a0d44556fe.jpg',
      'https://i.pinimg.com/736x/f9/8c/a9/f98ca9da93b47c49744f8ad183785bb9.jpg'
    ]
  },
  Smartphones: {
    names: ['iPhone 12', 'Samsung Galaxy S21'],
    descriptions: ['Latest model with cutting-edge features', 'Flagship smartphone from Samsung'],
    priceRange: [699, 1200],
    thumbnailURLs: [
      'https://i.pinimg.com/736x/33/9d/0f/339d0fc5bbf9dfc9ae2d7539afcc9911.jpg',
      'https://i.pinimg.com/736x/3f/58/63/3f58630ea9fbed01954d24b7b574f60a.jpg'
    ]
  },
  Laptops: {
    names: ['Dell XPS 13', 'MacBook Pro 16'],
    descriptions: ['Powerful laptop with a compact design', 'High-performance laptop for professionals and creatives'],
    priceRange: [800, 2500], // Example: $800 - $2500
    thumbnailURLs: [
      'https://i.pinimg.com/736x/d4/d0/e6/d4d0e68e30117fe5e1c3f200ed04db5d.jpg',
      'https://i.pinimg.com/736x/12/3e/f6/123ef687e4fa6f6c9fe9c22df36045fc.jpg'
    ]
  },
  Tablets: {
    names: ['iPad Pro 12.9', 'Samsung Galaxy Tab S7'],
    descriptions: ['Large tablet with stunning display and power', 'Premium tablet for work and play'],
    priceRange: [600, 1200],
    thumbnailURLs: [
      'https://i.pinimg.com/736x/31/49/9c/31499c290c0debf619289c68911f975d.jpg',
      'https://i.pinimg.com/736x/d5/4f/8e/d54f8ed669e71e44f5b7aa13fb04567a.jpg'
    ]
  },
  Cameras: {
    names: ['Canon EOS R5', 'Nikon Z6'],
    descriptions: ['Mirrorless camera with 8K video and high resolution', 'Full-frame mirrorless camera with excellent image quality'],
    priceRange: [1500, 4000],
    thumbnailURLs: [
      'https://i.pinimg.com/736x/be/db/a6/bedba68744108caff81981ed77b95980.jpg',
      'https://i.pinimg.com/736x/d2/86/de/d286de153cf4f6c9ce437780aedc5ab3.jpg'
    ]
  },
  Televisions: {
    names: ['Samsung QLED 65"', 'LG OLED 55"'],
    descriptions: ['Ultra-high-definition 4K QLED TV', 'Stunning 4K OLED TV with perfect black levels'],
    priceRange: [600, 2500],
    thumbnailURLs: [
      'https://i.pinimg.com/736x/31/f2/3d/31f23dc3c6cec10b31702b23707c04b9.jpg',
      'https://i.pinimg.com/736x/c6/d6/d0/c6d6d07259aeffe54ecb27dfac5f90e8.jpg'
    ]
  },
  Headphones: {
    names: ['Sony WH-1000XM4', 'Bose QuietComfort 35 II'],
    descriptions: ['Industry-leading noise cancellation and sound quality', 'Comfortable and high-quality noise-canceling headphones'],
    priceRange: [250, 400],
    thumbnailURLs: [
      'https://i.pinimg.com/736x/c3/8f/ab/c38fabd0168efa39bf9f86ccbf6b881e.jpg',
      'https://i.pinimg.com/736x/20/38/29/20382909d1d4f14f517f0ac347706526.jpg'
    ]
  },
  'Wearable Tech': {
    names: ['Apple Watch Series 7', 'Samsung Galaxy Watch 4'],
    descriptions: ['Smartwatch with advanced health tracking features', 'Feature-packed smartwatch with fitness tracking'],
    priceRange: [350, 500],
    thumbnailURLs: [
      'https://i.pinimg.com/736x/61/e9/ff/61e9ffac91f05bb610c6c774f17c7177.jpg',
      'https://i.pinimg.com/736x/04/70/61/047061338a6a0b9e0367349618748220.jpg'
    ]
  },
  'Gaming Consoles': {
    names: ['PlayStation 5', 'Xbox Series X'],
    descriptions: ['Next-gen gaming console with lightning-fast load times', 'Powerful console for the ultimate gaming experience'],
    priceRange: [499, 799],
    thumbnailURLs: [
      'https://i.pinimg.com/736x/dc/2c/12/dc2c120ece4867837d63c1808f20ca6b.jpg',
      'https://i.pinimg.com/736x/ae/4c/bf/ae4cbf8ed798e2f1520541e2e80593f9.jpg'
    ]
  },
  'Video Games': {
    names: ['The Last of Us Part II', 'Cyberpunk 2077'],
    descriptions: ['Highly acclaimed action-adventure game', 'Open-world RPG with futuristic action and storytelling'],
    priceRange: [40, 70],
    thumbnailURLs: [
      'https://i.pinimg.com/736x/9b/54/f3/9b54f3e9888bc301112db47cfe1ed3ea.jpg',
      'https://i.pinimg.com/736x/14/c8/96/14c896e0730044e222018d65a338eab5.jpg'
    ]
  },
  Books: {
    names: ['The Great Gatsby', '1984'],
    descriptions: ['A classic novel by F. Scott Fitzgerald', 'A dystopian novel by George Orwell'],
    priceRange: [10, 25],
    thumbnailURLs: [
      'https://i.pinimg.com/736x/df/2e/8c/df2e8ce5632552806a6740bffbbfa2ca.jpg',
      'https://i.pinimg.com/736x/43/75/b7/4375b7d9bf24b88aa53744b417227485.jpg'
    ]
  },
  Stationery: {
    names: ['Pilot G2 Gel Pens', 'Moleskine Classic Notebook'],
    descriptions: ['Smooth gel pens for everyday writing', 'Premium notebook for journaling and note-taking'],
    priceRange: [5, 20],
    thumbnailURLs: [
      'https://i.pinimg.com/736x/58/34/4c/58344c50b50d42814718380a6e14aa83.jpg',
      'https://i.pinimg.com/736x/69/d2/d1/69d2d1249fa17cdc37eebabb146c9d71.jpg'
    ]
  },
  'Home Decor': {
    names: ['Decorative Throw Pillow', 'Framed Wall Art'],
    descriptions: ['Soft and stylish throw pillow for your living room', 'Premium framed wall art for any space'],
    priceRange: [20, 100],
    thumbnailURLs: [
      'https://i.pinimg.com/736x/47/c5/0b/47c50b1114ba4c2c5c99117a3608ee4a.jpg',
      'https://i.pinimg.com/736x/1d/ec/f3/1decf39e58d8f957b8fc7d3f3ac9ee1e.jpg'
    ]
  },
  // Furniture: {
  //   names: ['Wooden Dining Table', 'Leather Office Chair'],
  //   descriptions: ['Elegant wooden dining table for any home', 'Comfortable and stylish leather office chair'],
  //   priceRange: [150, 800],
  //   thumbnailURLs: [
  //     'https://i.pinimg.com/736x/5a/47/a4/5a47a4dda6f92a18a22410018e284a3e.jpg',
  //     'https://i.pinimg.com/736x/dc/8d/eb/dc8deb6add61c7623054816b06083dda.jpg'
  //   ]
  // },
  // 'Kitchen Appliances': {
  //   names: ['Ninja Blender', 'Instant Pot'],
  //   descriptions: ['High-powered blender for smoothies and soups', 'Multi-function pressure cooker for quick meals'],
  //   priceRange: [50, 150],
  //   thumbnailURLs: [
  //     'https://i.pinimg.com/736x/c7/92/6c/c7926c4bdc22ccc7b4a4f3c16f44de3f.jpg',
  //     'https://i.pinimg.com/736x/12/1a/54/121a5495b298c6445168cef3377fca9f.jpg'
  //   ]
  // },
  // Cookware: {
  //   names: ['Cast Iron Skillet', 'Stainless Steel Cookware Set'],
  //   descriptions: ['Durable cast iron skillet for perfect searing', 'Premium stainless steel cookware set for your kitchen'],
  //   priceRange: [30, 200],
  //   thumbnailURLs: [
  //     'https://i.pinimg.com/736x/df/6c/05/df6c050964e934b6e6f973265fc3d471.jpg',
  //     'https://i.pinimg.com/736x/35/d3/96/35d396fd462dcf9c9a422340a8a0fa19.jpg'
  //   ]
  // },
  // 'Bedding & Bath': {
  //   names: ['Memory Foam Mattress', 'Fluffy Bath Towels'],
  //   descriptions: ['Supportive memory foam mattress for a good night’s sleep', 'Soft and absorbent bath towels'],
  //   priceRange: [100, 600],
  //   thumbnailURLs: [
  //     'https://i.pinimg.com/736x/08/5a/5b/085a5bacc170a6087e6553d0d02ee4c0.jpg',
  //     'https://i.pinimg.com/736x/50/72/07/5072079d1218058a78372d552dbe2565.jpg'
  //   ]
  // },
  // Lighting: {
  //   names: ['Smart LED Desk Lamp', 'Pendant Light Fixture'],
  //   descriptions: ['Adjustable LED desk lamp with smart features', 'Stylish pendant light fixture for your home'],
  //   priceRange: [20, 150],
  //   thumbnailURLs: [
  //     'https://i.pinimg.com/736x/24/55/4a/24554aafc97793d4f15264a810910ee1.jpg',
  //     'https://i.pinimg.com/736x/f9/83/d3/f983d3ebd0f8f16c074fbf661ea752c8.jpg'
  //   ]
  // },
  // 'Tools & Hardware': {
  //   names: ['Cordless Drill', 'Mechanics Tool Set'],
  //   descriptions: ['Powerful cordless drill for all your DIY projects', 'Comprehensive mechanic’s tool set for any repair job'],
  //   priceRange: [50, 250],
  //   thumbnailURLs: [
  //     'https://i.pinimg.com/736x/06/fd/cd/06fdcd19ee8e9e34bd53165a4c0e8ea2.jpg',
  //     'https://i.pinimg.com/736x/47/9d/65/479d65fc2ebac900b57839871c4a62a6.jpg'
  //   ]
  // },
  // 'Garden & Outdoor': {
  //   names: ['Garden Hose', 'Portable BBQ Grill'],
  //   descriptions: ['Heavy-duty garden hose for easy watering', 'Compact portable BBQ grill for outdoor cooking'],
  //   priceRange: [20, 200],
  //   thumbnailURLs: [
  //     'https://i.pinimg.com/736x/e5/98/55/e59855af6f601b6cece0f5ccb291d5fd.jpg',
  //     'https://i.pinimg.com/736x/dc/19/01/dc1901e65479caa18d74ac0b86aa5098.jpg'
  //   ]
  // },
  // 'Clothing - Men': {
  //   names: ['Men’s Casual T-Shirt', 'Men’s Denim Jeans'],
  //   descriptions: ['Comfortable cotton T-shirt for daily wear', 'Classic denim jeans with a modern fit'],
  //   priceRange: [15, 50],
  //   thumbnailURLs: [
  //     'https://i.pinimg.com/736x/b8/a1/18/b8a118bd8d380664fa3e9e80e4595181.jpg',
  //     'https://i.pinimg.com/736x/bb/c5/91/bbc591a3ef7d4bb17570114f17a9ea18.jpg'
  //   ]
  // },
  // 'Clothing - Women': {
  //   names: ['Women’s Floral Dress', 'Women’s Blouse'],
  //   descriptions: ['Elegant floral dress for casual or formal occasions', 'Stylish blouse for office or outings'],
  //   priceRange: [30, 80],
  //   thumbnailURLs: [
  //     'https://i.pinimg.com/736x/57/c0/36/57c036ec76e4e765a4b692638e2705c2.jpg',
  //     'https://i.pinimg.com/736x/b0/f8/e3/b0f8e340cc626783de3315e115b220b8.jpg'
  //   ]
  // },
  // 'Clothing - Kids': {
  //   names: ['Boys’ Hoodie', 'Girls’ Skirt'],
  //   descriptions: ['Cozy hoodie for boys, perfect for chilly days', 'Fun and comfortable skirt for girls'],
  //   priceRange: [10, 30],
  //   thumbnailURLs: [
  //     'https://i.pinimg.com/736x/11/8c/0f/118c0f2076e7bd7464feb162aad7d9a6.jpg',
  //     'https://i.pinimg.com/736x/62/ee/1f/62ee1f726c392c68c1b0f1146e560bf1.jpg'
  //   ]
  // },
  // Footwear: {
  //   names: ['Men’s Running Shoes', 'Women’s Sandals'],
  //   descriptions: ['Lightweight running shoes for men', 'Comfortable and stylish sandals for women'],
  //   priceRange: [25, 70],
  //   thumbnailURLs: [
  //     'https://i.pinimg.com/736x/0e/f1/13/0ef113de4b877881bd328ee17f51f640.jpg',
  //     'https://i.pinimg.com/736x/05/12/d7/0512d76db2f548d4fe92f907e3e258b4.jpg'
  //   ]
  // },
  // Watches: {
  //   names: ['Classic Wristwatch', 'Smartwatch'],
  //   descriptions: ['Timeless wristwatch with a leather band', 'Modern smartwatch with fitness tracking features'],
  //   priceRange: [50, 250],
  //   thumbnailURLs: [
  //     'https://i.pinimg.com/736x/6d/a1/ab/6da1ab1bf5aa357c48942a65f0876ed9.jpg',
  //     'https://i.pinimg.com/736x/1b/dd/aa/1bddaa19d6a629e01505000fbf5dc5c6.jpg'
  //   ]
  // },
  // Jewelry: {
  //   names: ['Gold Necklace', 'Diamond Ring'],
  //   descriptions: ['Elegant gold necklace for special occasions', 'Sparkling diamond ring with a timeless design'],
  //   priceRange: [100, 500],
  //   thumbnailURLs: [
  //     'https://i.pinimg.com/736x/7c/2c/c2/7c2cc2d46f49b1b536c69b7b42c69539.jpg',
  //     'https://i.pinimg.com/736x/3a/dc/3b/3adc3bc57d71f9e8a1d53c54a0631f8b.jpg'
  //   ]
  // },
  // 'Beauty Products': {
  //   names: ['Luxury Lipstick', 'Eyelash Serum'],
  //   descriptions: ['High-quality lipstick in a range of colors', 'Revitalizing eyelash serum for longer lashes'],
  //   priceRange: [15, 50],
  //   thumbnailURLs: [
  //     'https://i.pinimg.com/736x/0c/b6/f4/0cb6f438bb76ef755c4668b97778440b.jpg',
  //     'https://i.pinimg.com/736x/20/c7/88/20c7886177d6741907819046eec61b82.jpg'
  //   ]
  // },
  // Skincare: {
  //   names: ['Moisturizing Cream', 'Anti-Aging Serum'],
  //   descriptions: ['Rich moisturizing cream for daily hydration', 'Powerful anti-aging serum for youthful skin'],
  //   priceRange: [20, 100],
  //   thumbnailURLs: [
  //     'https://i.pinimg.com/736x/2a/22/8b/2a228b3a0b8b3d8497b6154f9c26ffab.jpg',
  //     'https://i.pinimg.com/736x/53/cf/74/53cf749d9d63997819427e53ba5eaa1d.jpg'
  //   ]
  // },
  // 'Hair Care': {
  //   names: ['Shampoo & Conditioner Set', 'Hair Styling Gel'],
  //   descriptions: ['Shampoo and conditioner set for healthy hair', 'Strong hold hair styling gel for all-day control'],
  //   priceRange: [10, 30],
  //   thumbnailURLs: [
  //     'https://i.pinimg.com/736x/01/04/dd/0104dd626f85f260c732fc8d847bdf83.jpg',
  //     'https://i.pinimg.com/736x/84/ab/35/84ab35118a388b30109c9cfd2887036a.jpg'
  //   ]
  // },
  // 'Health & Wellness': {
  //   names: ['Multivitamin Supplements', 'Yoga Mat'],
  //   descriptions: ['Daily multivitamin supplements for overall health', 'Comfortable yoga mat for home or studio use'],
  //   priceRange: [15, 50],
  //   thumbnailURLs: [
  //     'https://i.pinimg.com/736x/10/2f/4e/102f4eb7a86cda7006294d2a0287ca8d.jpg',
  //     'https://i.pinimg.com/736x/fb/a0/cd/fba0cd73a567541a2281e17331a215a2.jpg'
  //   ]
  // },
  // 'Sports Equipment': {
  //   names: ['Basketball', 'Soccer Ball'],
  //   descriptions: ['Durable basketball for indoor and outdoor play', 'High-quality soccer ball for practice or matches'],
  //   priceRange: [20, 60],
  //   thumbnailURLs: [
  //     'https://i.pinimg.com/736x/50/90/50/509050faf1df0dc92a11f373446fb8f0.jpg',
  //     'https://i.pinimg.com/736x/a6/fd/65/a6fd6507d6d776b9adda4cc0303463a3.jpg'
  //   ]
  // },
  // 'Gym & Fitness': {
  //   names: ['Resistance Bands', 'Dumbbell Set'],
  //   descriptions: ['Set of resistance bands for full-body workouts', 'Adjustable dumbbell set for strength training'],
  //   priceRange: [25, 120],
  //   thumbnailURLs: [
  //     'https://i.pinimg.com/736x/8c/ef/fb/8ceffbcf77128466057d9b8dc347c308.jpg',
  //     'https://i.pinimg.com/736x/4a/dd/94/4add94e4022d2fd429771d86692fb230.jpg'
  //   ]
  // },
  // Cycling: {
  //   names: ['Mountain Bike', 'Cycling Helmet'],
  //   descriptions: ['Durable mountain bike for off-road adventures', 'Safety helmet designed for cycling'],
  //   priceRange: [150, 500],
  //   thumbnailURLs: [
  //     'https://i.pinimg.com/736x/4f/b1/5d/4fb15d9839f8882f4ad4128e237e3819.jpg',
  //     'https://i.pinimg.com/736x/01/d7/79/01d779948b4cb8300fe65938076f17c1.jpg'
  //   ]
  // },
  // 'Camping & Hiking': {
  //   names: ['Tent', 'Sleeping Bag'],
  //   descriptions: ['Lightweight tent for camping and hiking trips', 'Cozy sleeping bag for outdoor adventures'],
  //   priceRange: [40, 200],
  //   thumbnailURLs: [
  //     'https://i.pinimg.com/736x/f2/b1/70/f2b170fe39500e728002cd66f16a47cf.jpg',
  //     'https://i.pinimg.com/736x/5a/e2/7e/5ae27e7084dea07ff8bf7b4f26894772.jpg'
  //   ]
  // },
  // 'Automotive Parts': {
  //   names: ['Car Battery', 'Brake Pads'],
  //   descriptions: ['Reliable car battery for various car models', 'High-quality brake pads for optimal stopping power'],
  //   priceRange: [50, 150],
  //   thumbnailURLs: [
  //     'https://i.pinimg.com/736x/af/f4/ad/aff4ad61e87ca8bb8119229ade599585.jpg',
  //     'https://i.pinimg.com/736x/dc/c5/5d/dcc55d14bb2d3227dafe73a150b0f699.jpg'
  //   ]
  // },
  // 'Car Accessories': {
  //   names: ['Car Seat Covers', 'LED Car Light Strips'],
  //   descriptions: ['High-quality seat covers to protect your car seats', 'Colorful LED strips to decorate the interior of your car'],
  //   priceRange: [29.99, 59.99],
  //   thumbnailURLs: [
  //     'https://i.pinimg.com/736x/e6/bc/a8/e6bca8dc0a24ecd6423094e2c87b7426.jpg',
  //     'https://i.pinimg.com/736x/f4/37/83/f437836db5ac28be17ebe49aa0a04218.jpg'
  //   ]
  // },
  // 'Pet Supplies': {
  //   names: ['Pet Bed', 'Interactive Pet Toy'],
  //   descriptions: ['Comfortable bed for your furry friend', 'Engaging toy to keep your pet entertained for hours'],
  //   priceRange: [9.99, 39.99],
  //   thumbnailURLs: [
  //     'https://i.pinimg.com/736x/0f/16/9c/0f169cf58b1fb416db46591b0d6f27e4.jpg',
  //     'https://i.pinimg.com/736x/da/23/a0/da23a0916b204ac326807a453093e120.jpg'
  //   ]
  // },
  // 'Baby Products': {
  //   names: ['Baby Stroller', 'Baby Monitor'],
  //   descriptions: ['Durable stroller with adjustable features for comfort', 'Wireless baby monitor for peace of mind'],
  //   priceRange: [79.99, 150.00],
  //   thumbnailURLs: [
  //     'https://i.pinimg.com/736x/e0/b6/ae/e0b6aeffa213981b137c88864b36b931.jpg',
  //     'https://i.pinimg.com/736x/df/8c/bc/df8cbcd24cad13c4ed4b52cbe37b0883.jpg'
  //   ]
  // },
  // 'Toys & Games': {
  //   names: ['Building Blocks Set', 'Action Figure Set'],
  //   descriptions: ['Colorful building blocks for creativity', 'A set of action figures from your favorite series'],
  //   priceRange: [14.99, 29.99],
  //   thumbnailURLs: [
  //     'https://i.pinimg.com/736x/d4/f0/09/d4f009d65edb5b76049be222416e1bb8.jpg',
  //     'https://i.pinimg.com/736x/73/80/40/73804016329ba5896e2fd7f6958a1bf5.jpg'
  //   ]
  // },
  // 'School Supplies': {
  //   names: ['Backpack', 'Pencil Case'],
  //   descriptions: ['Spacious backpack for school essentials', 'Stylish pencil case for organizing writing tools'],
  //   priceRange: [7.99, 39.99],
  //   thumbnailURLs: [
  //     'https://i.pinimg.com/736x/61/6b/9e/616b9e032905beb9e7d889a01ee28360.jpg',
  //     'https://i.pinimg.com/736x/00/5a/c8/005ac8020c6c68f6a46568c986c2f5fd.jpg'
  //   ]
  // },
  // 'Office Equipment': {
  //   names: ['Office Chair', 'Desk Organizer'],
  //   descriptions: ['Ergonomically designed chair for all-day comfort', 'Keep your desk neat with this space-saving organizer'],
  //   priceRange: [19.99, 129.99],
  //   thumbnailURLs: [
  //     'https://i.pinimg.com/736x/77/49/6f/77496f48d71ec1f0ded95cb35b7db519.jpg',
  //     'https://i.pinimg.com/736x/cc/15/b1/cc15b1fe261128827fda20766bb3847d.jpg'
  //   ]
  // },
  // 'Groceries': {
  //   names: ['Organic Apples (1kg)', 'Whole Wheat Bread'],
  //   descriptions: ['Fresh, organic apples for a healthy snack', 'Freshly baked whole wheat bread'],
  //   priceRange: [2.49, 5.99],
  //   thumbnailURLs: [
  //     'https://i.pinimg.com/736x/00/ca/b0/00cab08fb5d8d94ecd47d38f6f94c0c9.jpg',
  //     'https://i.pinimg.com/736x/19/45/8e/19458eea783b42508ba7e6b1ad8a7bc9.jpg'
  //   ]
  // },
  // 'Snacks & Beverages': {
  //   names: ['Granola Bars', 'Fruit Juice (500ml)'],
  //   descriptions: ['Healthy granola bars for an energy boost', 'Freshly squeezed fruit juice with no added sugar'],
  //   priceRange: [2.49, 3.99],
  //   thumbnailURLs: [
  //     'https://i.pinimg.com/736x/70/f6/76/70f676d98d256beb05a49770ee3f6a2b.jpg',
  //     'https://i.pinimg.com/736x/54/b1/9f/54b19f6e9ce882441a3c1c5f81ca2b8b.jpg'
  //   ]
  // },
  // 'Organic Foods': {
  //   names: ['Organic Olive Oil (500ml)', 'Organic Avocados (4 pieces)'],
  //   descriptions: ['Cold-pressed organic olive oil', 'Fresh, organic avocados'],
  //   priceRange: [4.99, 10.99],
  //   thumbnailURLs: [
  //     'https://i.pinimg.com/736x/28/35/15/283515e2e8d6af1bfaeb93b30102e857.jpg',
  //     'https://i.pinimg.com/736x/48/4a/fc/484afcf525082e6ce591da1a8454df95.jpg'
  //   ]
  // },
  // 'Cleaning Supplies': {
  //   names: ['Multi-surface Cleaner', 'Microfiber Cleaning Cloth'],
  //   descriptions: ['All-purpose cleaner for various surfaces', 'Soft microfiber cloth for effective cleaning'],
  //   priceRange: [1.99, 4.99],
  //   thumbnailURLs: [
  //     'https://i.pinimg.com/736x/8b/f1/3f/8bf13f39aa8e2e072143870eaf2541ee.jpg',
  //     'https://i.pinimg.com/736x/2f/64/c6/2f64c660eef47f998355897967a8055d.jpg'
  //   ]
  // },
  // 'Personal Care': {
  //   names: ['Shampoo (500ml)', 'Toothpaste (100g)'],
  //   descriptions: ['Nourishing shampoo for healthy hair', 'Refreshing toothpaste for a clean mouth'],
  //   priceRange: [2.49, 6.99],
  //   thumbnailURLs: [
  //     'https://i.pinimg.com/736x/56/cc/99/56cc997f67c0abae927c75f7ef60b868.jpg',
  //     'https://i.pinimg.com/736x/13/87/f5/1387f53c19d26ca580c266e616d2938c.jpg'
  //   ]
  // },
  // 'Musical Instruments': {
  //   names: ['Electric Guitar', 'Drum Kit'],
  //   descriptions: ['High-quality electric guitar for musicians', 'Complete drum kit for beginners and pros'],
  //   priceRange: [149.99, 299.99],
  //   thumbnailURLs: [
  //     'https://i.pinimg.com/736x/18/7c/35/187c35bdef3714b3b62f55d87d5f6173.jpg',
  //     'https://i.pinimg.com/736x/91/2a/6d/912a6daf32f8de0b8dd9860b2966e30b.jpg'
  //   ]
  // },
  // 'Art & Craft Supplies': {
  //   names: ['Acrylic Paint Set', 'Canvas Pads (10 sheets)'],
  //   descriptions: ['Set of vibrant acrylic paints for artists', 'Canvas pads for painting and drawing'],
  //   priceRange: [7.99, 19.99],
  //   thumbnailURLs: [
  //     'https://i.pinimg.com/736x/31/4e/56/314e561ee8ea955bd306266a6af5e0e2.jpg',
  //     'https://i.pinimg.com/736x/19/71/51/1971518a8387f2d7eff79f26d75961f1.jpg'
  //   ]
  // },
  // 'Collectibles': {
  //   names: ['Vintage Comic Book', 'Limited Edition Action Figure'],
  //   descriptions: ['Rare vintage comic book for collectors', 'Limited edition action figure from a popular series'],
  //   priceRange: [20.00, 49.99],
  //   thumbnailURLs: [
  //     'https://i.pinimg.com/736x/4a/83/06/4a8306f43ac20e91d16eafcaf4910667.jpg',
  //     'https://i.pinimg.com/736x/bc/68/93/bc6893bc51b9ce3b1a4953a37cef5898.jpg'
  //   ]
  // },
  // 'Gift Items': {
  //   names: ['Gift Box Set', 'Personalized Mug'],
  //   descriptions: ['Beautifully packaged gift box with assorted items', 'Customizable mug for special occasions'],
  //   priceRange: [9.99, 29.99],
  //   thumbnailURLs: [
  //     'https://i.pinimg.com/736x/2a/6e/c5/2a6ec51230500cd5193005c26dc0cba1.jpg',
  //     'https://i.pinimg.com/736x/2d/45/9b/2d459b434badc6eb2d559f7c31e3d53c.jpg'
  //   ]
  // }
  // Add similar details for other categories...
};

const createProducts = async () => {
  const t = await sequelize.transaction();
  try {
    const shops = await Shop.findAll({ limit: 50, transaction: t });

    for (const shop of shops) {
      const categories = await Category.findAll({
        where: { shopId: shop.id },
        transaction: t
      });

      for (const category of categories) {
        const categoryDetails = categoryProductDetails[category.name];
        if (!categoryDetails) continue;

        for (let i = 0; i < 2; i++) {
          const productName = categoryDetails.names[i];
          const productDescription = categoryDetails.descriptions[i];
          const productPrice = Math.floor(Math.random() * 
            (categoryDetails.priceRange[1] - categoryDetails.priceRange[0] + 1)) 
            + categoryDetails.priceRange[0];
          const productThumbnailURL = categoryDetails.thumbnailURLs[i];

          const product = await Product.create({
            shopId: shop.id,
            name: productName,
            description: productDescription,
            price: productPrice,
            salePrice: Math.floor(productPrice * 0.9), // 10% discount
            stock: 100,
            imageUrl: productThumbnailURL,
          }, { transaction: t });

          await ProductCategory.create({
            productId: product.id,
            categoryId: category.id
          }, { transaction: t });
        }
      }
    }

    await t.commit();
    console.log('✅ Products created and linked to categories successfully.');
  } catch (error) {
    await t.rollback();
    console.error('❌ Error creating products:', error);
  } finally {
    await sequelize.close();
  }
};
// createCategory();
createProducts();