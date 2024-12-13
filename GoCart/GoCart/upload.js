// Import the functions you need from the SDKs you need
const { initializeApp } = require("firebase/app");
const { getFirestore, collection, doc, setDoc } = require("firebase/firestore");
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyApAj5IylS7DgSy5bmD1SE2NLx84mItSVQ",
  authDomain: "gokart-19d22.firebaseapp.com",
  projectId: "gokart-19d22",
  storageBucket: "gokart-19d22.firebasestorage.app",
  messagingSenderId: "263383792771",
  appId: "1:263383792771:web:2c82aa76882f52246bafb6",
  measurementId: "G-0X0J4REXBT",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const sampleProducts = [
  {
    id: "b2c3d4e5f6",
    name: "Apple MacBook Air M2",
    category: "Electronics",
    price: 1199,
    currency: "USD",
    image_url: "https://example.com/images/macbook_air_m2.jpg",
    description: "Lightweight laptop with M2 chip and Retina display.",
    rating: 4.9,
    reviews: 2300,
    is_favorite: true,
    stock: 20,
    tags: ["tech", "laptop", "new"],
  },
  {
    id: "a7b8c9d0e1",
    name: "Dyson V15 Detect Vacuum",
    category: "Home Appliances",
    price: 749,
    currency: "USD",
    image_url: "https://example.com/images/dyson_v15.jpg",
    description: "Powerful cordless vacuum with laser for precise cleaning.",
    rating: 4.8,
    reviews: 1100,
    is_favorite: false,
    stock: 15,
    tags: ["cleaning", "home", "luxury"],
  },
  {
    id: "f5g6h7i8j9",
    name: "Samsung 65-inch QLED TV",
    category: "Electronics",
    price: 999,
    currency: "USD",
    image_url: "https://example.com/images/samsung_qled.jpg",
    description: "Smart 4K TV with vibrant QLED display and HDR technology.",
    rating: 4.7,
    reviews: 800,
    is_favorite: true,
    stock: 25,
    tags: ["home", "entertainment", "tech"],
  },
  {
    id: "k2l3m4n5o6",
    name: "Nike Sportswear Windrunner Jacket",
    category: "Clothing",
    price: 120,
    currency: "USD",
    image_url: "https://example.com/images/nike_windrunner.jpg",
    description: "Lightweight and stylish jacket for active lifestyles.",
    rating: 4.6,
    reviews: 320,
    is_favorite: false,
    stock: 50,
    tags: ["sport", "casual", "seasonal"],
  },
  {
    id: "p6q7r8s9t0",
    name: "Canon EOS R5 Camera",
    category: "Electronics",
    price: 3899,
    currency: "USD",
    image_url: "https://example.com/images/canon_eos_r5.jpg",
    description: "Professional mirrorless camera with 8K video recording.",
    rating: 4.9,
    reviews: 550,
    is_favorite: true,
    stock: 10,
    tags: ["photography", "tech", "professional"],
  },
  {
    id: "u3v4w5x6y7",
    name: "IKEA Billy Bookcase",
    category: "Furniture",
    price: 59,
    currency: "USD",
    image_url: "https://example.com/images/ikea_billy.jpg",
    description: "Classic bookcase with adjustable shelves.",
    rating: 4.5,
    reviews: 600,
    is_favorite: false,
    stock: 100,
    tags: ["home", "storage", "affordable"],
  },
  {
    id: "z1y2x3w4v5",
    name: "Levi's 501 Original Jeans",
    category: "Clothing",
    price: 89,
    currency: "USD",
    image_url: "https://example.com/images/levis_501.jpg",
    description: "Timeless straight-fit jeans with iconic style.",
    rating: 4.7,
    reviews: 900,
    is_favorite: true,
    stock: 60,
    tags: ["casual", "fashion", "durable"],
  },
  {
    id: "w8x9y0z1a2",
    name: "Rolex Submariner Watch",
    category: "Accessories",
    price: 9500,
    currency: "USD",
    image_url: "https://example.com/images/rolex_submariner.jpg",
    description: "Luxury dive watch with timeless design and precision.",
    rating: 4.9,
    reviews: 300,
    is_favorite: true,
    stock: 5,
    tags: ["luxury", "timepiece", "exclusive"],
  },
  {
    id: "b3c4d5e6f7",
    name: "Peloton Bike+",
    category: "Fitness",
    price: 2495,
    currency: "USD",
    image_url: "https://example.com/images/peloton_bike_plus.jpg",
    description: "Interactive indoor bike with live and on-demand classes.",
    rating: 4.8,
    reviews: 1200,
    is_favorite: false,
    stock: 20,
    tags: ["fitness", "home", "tech"],
  },
  {
    id: "g5h6i7j8k9",
    name: "Patagonia Down Sweater",
    category: "Clothing",
    price: 229,
    currency: "USD",
    image_url: "https://example.com/images/patagonia_down.jpg",
    description: "Warm and lightweight jacket made with recycled materials.",
    rating: 4.7,
    reviews: 400,
    is_favorite: true,
    stock: 30,
    tags: ["winter", "sustainable", "outdoor"],
  },
];

// Function to upload data to Firestore
const uploadProducts = async () => {
  try {
    const productCollection = collection(db, "products"); // Reference to the products collection

    for (const product of sampleProducts) {
      const productDoc = doc(productCollection, product.id); // Create a document with a specific ID
      await setDoc(productDoc, product); // Add or overwrite data in the document
      console.log(`Product with ID ${product.id} added successfully.`);
    }
  } catch (error) {
    console.error("Error uploading products to Firestore:", error);
  }
};

// Call the function to upload products
uploadProducts();
