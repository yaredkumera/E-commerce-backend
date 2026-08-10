import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Product from './models/productModel.js'

dotenv.config()

const products = [
  { name: "Breed Dry Dog Food", description: "High-quality dry dog food for daily nutrition.", category: "Pet Supplies", price: 100, stock: 50, rating: 4, reviews: 35, isNew: false, colors: [], image: "Product1.png" },
  { name: "CANON EOS DSLR Camera", description: "Professional-grade DSLR camera for photography enthusiasts.", category: "Electronics", price: 360, stock: 20, rating: 4, reviews: 95, isNew: false, colors: [], image: "Product2.png" },
  { name: "ASUS FHD Gaming Laptop", description: "High-performance gaming laptop with full HD display.", category: "Electronics", price: 700, stock: 15, rating: 5, reviews: 325, isNew: false, colors: [], image: "Product3.png" },
  { name: "Curology Product Set", description: "Personalized skincare set for daily routine.", category: "Beauty", price: 500, stock: 30, rating: 4, reviews: 145, isNew: false, colors: [], image: "Product6.png" },
  { name: "Kids Electric Car", description: "Battery-powered ride-on car for kids.", category: "Toys", price: 960, stock: 10, rating: 5, reviews: 65, isNew: true, colors: ["#DB4444", "#DB4444"], image: "Product5.png" },
  { name: "Jr. Zoom Soccer Cleats", description: "Lightweight soccer cleats built for speed and grip.", category: "Sportswear", price: 1160, stock: 25, rating: 5, reviews: 35, isNew: false, colors: ["#FFEB3B", "#DB4444"], image: "Product6.png" },
  { name: "GP11 Shooter USB Gamepad", description: "Ergonomic USB gamepad for PC gaming.", category: "Electronics", price: 660, stock: 40, rating: 4, reviews: 55, isNew: true, colors: ["#000000", "#DB4444"], image: "Product7.png" },
  { name: "Quilted Satin Jacket", description: "Warm quilted jacket with a satin finish.", category: "Fashion", price: 660, stock: 18, rating: 4, reviews: 55, isNew: false, colors: ["#4B5563", "#DB4444"], image: "Product8.png" },
  { name: "The north coat", description: "Stylish, warm winter coat for everyday wear.", category: "Fashion", price: 260, oldPrice: 360, stock: 22, rating: 5, reviews: 65, image: "/BestSell1.png" },
  { name: "Gucci duffle bag", description: "Premium leather duffle bag for travel.", category: "Fashion", price: 960, oldPrice: 1160, stock: 8, rating: 4, reviews: 65, image: "/BestSell2.png" },
  { name: "RGB liquid CPU Cooler", description: "Liquid CPU cooler with customizable RGB lighting.", category: "Electronics", price: 160, oldPrice: 170, stock: 12, rating: 4, reviews: 65, image: "/BestSell3.png" },
  { name: "Small BookShelf", description: "Compact bookshelf for home or office storage.", category: "Furniture", price: 360, stock: 35, rating: 5, reviews: 65, image: "/BestSell4.png" },
  { name: "HAVIT HV-G92 Gamepad", description: "Wired gamepad with responsive controls for PC gaming.", category: "Electronics", price: 120, oldPrice: 160, discount: 40, stock: 60, rating: 5, reviews: 88, image: "/FlashSales1.png" },
  { name: "AK-900 Wired Keyboard", description: "Durable wired keyboard built for daily typing and gaming.", category: "Electronics", price: 960, oldPrice: 1160, discount: 35, stock: 45, rating: 4, reviews: 75, image: "/FlashSales2.png" },
  { name: "IPS LCD Gaming Monitor", description: "IPS LCD monitor with crisp visuals for gaming.", category: "Electronics", price: 370, oldPrice: 400, discount: 30, stock: 14, rating: 5, reviews: 99, image: "/FlashSales3.png" },
  { name: "S-Series Comfort Chair", description: "Ergonomic chair designed for long, comfortable seating.", category: "Furniture", price: 375, oldPrice: 400, discount: 25, stock: 16, rating: 4, reviews: 99, image: "/FlashSales4.png" },
]

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log("Connected to MongoDB")

    await Product.deleteMany()
    console.log("Old products cleared")

    await Product.insertMany(products)
    console.log(`${products.length} products seeded successfully`)

    process.exit(0)
  } catch (err) {
    console.error("Seeding failed:", err)
    process.exit(1)
  }
}

seedDatabase()