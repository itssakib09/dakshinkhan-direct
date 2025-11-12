import { 
  writeBatch,
  doc,
  serverTimestamp 
} from 'firebase/firestore'
import { db } from '../firebase/config'

/**
 * Seed sample users
 */
async function seedUsers() {
  console.log('👥 Seeding users...')
  
  const sampleUsers = [
    {
      uid: 'user_business_1',
      email: 'rashid.store@example.com',
      name: 'Rashid Ahmed',
      phone: '+8801712345678',
      role: 'business',
      isActive: true
    },
    {
      uid: 'user_service_1',
      email: 'karim.plumber@example.com',
      name: 'Abdul Karim',
      phone: '+8801812345679',
      role: 'service',
      isActive: true
    },
    {
      uid: 'user_customer_1',
      email: 'customer1@example.com',
      name: 'Fatima Khan',
      phone: '+8801912345680',
      role: 'customer',
      isActive: true
    }
  ]

  const batch = writeBatch(db)

  for (const user of sampleUsers) {
    const userRef = doc(db, 'users', user.uid)
    batch.set(userRef, {
      ...user,
      photoURL: '',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    })
  }

  await batch.commit()
  console.log(`✅ Seeded ${sampleUsers.length} users`)
}

/**
 * Seed sample listings
 */
async function seedListings() {
  console.log('🏪 Seeding listings...')
  
  const sampleListings = [
    {
      id: 'listing_1',
      ownerId: 'user_business_1',
      title: 'Rashid Electronics & Mobile Shop',
      description: 'Best mobile phones, laptops, and electronics in Dakshinkhan. Authorized dealer for Samsung, Xiaomi, and Walton.',
      category: 'electronics',
      subcategory: 'mobile-shop',
      phone: '+8801712345678',
      email: 'rashid.store@example.com',
      address: 'House 45, Road 3, Dakshinkhan, Dhaka-1230',
      location: {
        lat: 23.8759,
        lng: 90.4121
      },
      images: [],
      price: 0,
      priceRange: '৳5,000 - ৳50,000',
      rating: 4.5,
      reviewCount: 28,
      views: 342,
      verified: true,
      featured: true,
      openingHours: {
        monday: '9:00 AM - 9:00 PM',
        tuesday: '9:00 AM - 9:00 PM',
        wednesday: '9:00 AM - 9:00 PM',
        thursday: '9:00 AM - 9:00 PM',
        friday: '9:00 AM - 9:00 PM',
        saturday: '9:00 AM - 9:00 PM',
        sunday: 'Closed'
      },
      tags: ['electronics', 'mobile', 'laptop', 'accessories'],
      status: 'pending'
    },
    {
      id: 'listing_2',
      ownerId: 'user_service_1',
      title: 'Karim Plumbing Services',
      description: 'Professional plumbing services. Emergency repairs, installations, pipe fitting. Available 24/7.',
      category: 'services',
      subcategory: 'plumbing',
      phone: '+8801812345679',
      email: 'karim.plumber@example.com',
      address: 'Dakshinkhan, Dhaka',
      location: {
        lat: 23.8765,
        lng: 90.4130
      },
      images: [],
      price: 500,
      priceRange: '৳500 - ৳5,000',
      rating: 4.8,
      reviewCount: 45,
      views: 523,
      verified: true,
      featured: false,
      openingHours: {
        monday: '24 hours',
        tuesday: '24 hours',
        wednesday: '24 hours',
        thursday: '24 hours',
        friday: '24 hours',
        saturday: '24 hours',
        sunday: '24 hours'
      },
      tags: ['plumbing', 'emergency', 'repairs', '24/7'],
      status: 'pending'
    },
    {
      id: 'listing_3',
      ownerId: 'user_business_1',
      title: 'Fresh Vegetables & Fruits Market',
      description: 'Daily fresh vegetables and seasonal fruits. Best prices in the area.',
      category: 'grocery',
      subcategory: 'vegetables',
      phone: '+8801712345678',
      email: 'rashid.store@example.com',
      address: 'Dakshinkhan Bazar, Dhaka',
      location: {
        lat: 23.8770,
        lng: 90.4115
      },
      images: [],
      price: 0,
      priceRange: '৳20 - ৳500',
      rating: 4.2,
      reviewCount: 67,
      views: 892,
      verified: false,
      featured: false,
      openingHours: {
        monday: '6:00 AM - 8:00 PM',
        tuesday: '6:00 AM - 8:00 PM',
        wednesday: '6:00 AM - 8:00 PM',
        thursday: '6:00 AM - 8:00 PM',
        friday: '6:00 AM - 8:00 PM',
        saturday: '6:00 AM - 8:00 PM',
        sunday: '6:00 AM - 2:00 PM'
      },
      tags: ['vegetables', 'fruits', 'fresh', 'organic'],
      status: 'pending'
    },
    {
      id: 'listing_4',
      ownerId: 'user_business_1',
      title: 'City Pharmacy',
      description: 'Trusted pharmacy with all medicines available. Home delivery service.',
      category: 'pharmacy',
      subcategory: 'general',
      phone: '+8801712345678',
      email: 'rashid.store@example.com',
      address: 'House 67, Dakshinkhan Main Road',
      location: {
        lat: 23.8755,
        lng: 90.4125
      },
      images: [],
      price: 0,
      priceRange: 'Varies',
      rating: 4.6,
      reviewCount: 89,
      views: 1245,
      verified: true,
      featured: true,
      openingHours: {
        monday: '8:00 AM - 11:00 PM',
        tuesday: '8:00 AM - 11:00 PM',
        wednesday: '8:00 AM - 11:00 PM',
        thursday: '8:00 AM - 11:00 PM',
        friday: '8:00 AM - 11:00 PM',
        saturday: '8:00 AM - 11:00 PM',
        sunday: '8:00 AM - 11:00 PM'
      },
      tags: ['pharmacy', 'medicine', 'health', 'delivery'],
      status: 'pending'
    },
    {
      id: 'listing_5',
      ownerId: 'user_service_1',
      title: 'Modern Restaurant',
      description: 'Delicious Bengali and Chinese cuisine. Family-friendly environment.',
      category: 'restaurant',
      subcategory: 'bengali',
      phone: '+8801812345679',
      email: 'karim.plumber@example.com',
      address: 'Shop 12, Dakshinkhan Bazar',
      location: {
        lat: 23.8762,
        lng: 90.4118
      },
      images: [],
      price: 300,
      priceRange: '৳150 - ৳800',
      rating: 4.4,
      reviewCount: 123,
      views: 1876,
      verified: true,
      featured: false,
      openingHours: {
        monday: '11:00 AM - 11:00 PM',
        tuesday: '11:00 AM - 11:00 PM',
        wednesday: '11:00 AM - 11:00 PM',
        thursday: '11:00 AM - 11:00 PM',
        friday: '11:00 AM - 11:00 PM',
        saturday: '11:00 AM - 11:00 PM',
        sunday: '11:00 AM - 11:00 PM'
      },
      tags: ['restaurant', 'bengali', 'chinese', 'family'],
      status: 'pending'
    }
  ]

  const batch = writeBatch(db)

  for (const listing of sampleListings) {
    const listingRef = doc(db, 'listings', listing.id)
    batch.set(listingRef, {
      ...listing,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    })
  }

  await batch.commit()
  console.log(`✅ Seeded ${sampleListings.length} listings`)
}

/**
 * Seed analytics data
 */
async function seedAnalytics() {
  console.log('📊 Seeding analytics...')
  
  const userIds = ['user_business_1', 'user_service_1']
  const dates = getLast7Days()
  
  const batch = writeBatch(db)
  let count = 0

  for (const userId of userIds) {
    for (const date of dates) {
      const analyticsRef = doc(db, 'analytics', userId, 'daily', date)
      batch.set(analyticsRef, {
        date: date,
        views: Math.floor(Math.random() * 100) + 50,
        clicks: Math.floor(Math.random() * 50) + 10,
        leads: Math.floor(Math.random() * 10) + 1,
        revenue: Math.floor(Math.random() * 5000) + 500,
        topListings: ['listing_1', 'listing_2'],
        createdAt: serverTimestamp()
      })
      count++
    }
  }

  await batch.commit()
  console.log(`✅ Seeded ${count} analytics records`)
}

/**
 * Seed catalog/categories
 */
async function seedCatalog() {
  console.log('📁 Seeding catalog...')
  
  const categories = [
    {
      id: 'restaurant',
      name: 'Restaurants',
      name_bn: 'রেস্তোরা',
      icon: '🍽️',
      description: 'Find the best restaurants and food places',
      subcategories: ['bengali', 'chinese', 'fastfood', 'cafe'],
      active: true,
      order: 1
    },
    {
      id: 'grocery',
      name: 'Grocery & Food',
      name_bn: 'মুদি দোকান',
      icon: '🛒',
      description: 'Fresh groceries and daily essentials',
      subcategories: ['vegetables', 'meat', 'dairy', 'bakery'],
      active: true,
      order: 2
    },
    {
      id: 'pharmacy',
      name: 'Pharmacy',
      name_bn: 'ফার্মেসি',
      icon: '💊',
      description: 'Medicines and healthcare products',
      subcategories: ['general', 'ayurvedic', 'homeopathy'],
      active: true,
      order: 3
    },
    {
      id: 'electronics',
      name: 'Electronics',
      name_bn: 'ইলেকট্রনিক্স',
      icon: '📱',
      description: 'Mobile, laptops, and electronics',
      subcategories: ['mobile-shop', 'computer', 'accessories', 'repairs'],
      active: true,
      order: 4
    },
    {
      id: 'services',
      name: 'Services',
      name_bn: 'সেবা',
      icon: '🔧',
      description: 'Professional services',
      subcategories: ['plumbing', 'electrical', 'carpenter', 'cleaning'],
      active: true,
      order: 5
    },
    {
      id: 'clothing',
      name: 'Clothing & Fashion',
      name_bn: 'পোশাক',
      icon: '👕',
      description: 'Clothing stores and fashion',
      subcategories: ['mens', 'womens', 'kids', 'accessories'],
      active: true,
      order: 6
    }
  ]

  const batch = writeBatch(db)

  for (const category of categories) {
    const categoryRef = doc(db, 'catalog', category.id)
    batch.set(categoryRef, {
      ...category,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    })
  }

  await batch.commit()
  console.log(`✅ Seeded ${categories.length} categories`)
}

/**
 * Seed catalog products (pre-loaded items businesses can add)
 */
async function seedCatalogProducts() {
  console.log('📦 Seeding catalog products...')
  
  const products = [
    // Pharmacy products
    {
      id: 'napa-500mg',
      name: 'Napa 500mg',
      name_bn: 'নাপা ৫০০ মিগ্রা',
      category: 'pharmacy',
      subcategory: 'general',
      defaultPrice: 2,
      unit: 'piece',
      defaultImage: 'https://via.placeholder.com/300x300?text=Napa+500mg',
      description: 'Paracetamol tablet for fever and pain relief',
      description_bn: 'জ্বর এবং ব্যথা উপশমের জন্য প্যারাসিটামল ট্যাবলেট',
      tags: ['medicine', 'paracetamol', 'fever', 'pain'],
      active: true
    },
    {
      id: 'sergel-20mg',
      name: 'Sergel 20mg',
      name_bn: 'সার্জেল ২০ মিগ্রা',
      category: 'pharmacy',
      subcategory: 'general',
      defaultPrice: 5,
      unit: 'piece',
      defaultImage: 'https://via.placeholder.com/300x300?text=Sergel+20mg',
      description: 'Omeprazole capsule for acidity',
      description_bn: 'অম্লতার জন্য ওমিপ্রাজল ক্যাপসুল',
      tags: ['medicine', 'acidity', 'gastric'],
      active: true
    },
    {
      id: 'seclo-20mg',
      name: 'Seclo 20mg',
      name_bn: 'সেক্লো ২০ মিগ্রা',
      category: 'pharmacy',
      subcategory: 'general',
      defaultPrice: 4,
      unit: 'piece',
      defaultImage: 'https://via.placeholder.com/300x300?text=Seclo+20mg',
      description: 'Omeprazole for gastric problems',
      description_bn: 'গ্যাস্ট্রিক সমস্যার জন্য ওমিপ্রাজল',
      tags: ['medicine', 'gastric'],
      active: true
    },
    
    // Grocery products
    {
      id: 'rice-miniket',
      name: 'Miniket Rice',
      name_bn: 'মিনিকেট চাল',
      category: 'grocery',
      subcategory: 'rice',
      defaultPrice: 60,
      unit: 'kg',
      defaultImage: 'https://via.placeholder.com/300x300?text=Miniket+Rice',
      description: 'Premium quality miniket rice',
      description_bn: 'প্রিমিয়াম মানের মিনিকেট চাল',
      tags: ['rice', 'food', 'staple'],
      active: true
    },
    {
      id: 'rice-nazirshail',
      name: 'Nazirshail Rice',
      name_bn: 'নাজিরশাইল চাল',
      category: 'grocery',
      subcategory: 'rice',
      defaultPrice: 70,
      unit: 'kg',
      defaultImage: 'https://via.placeholder.com/300x300?text=Nazirshail+Rice',
      description: 'Aromatic nazirshail rice',
      description_bn: 'সুগন্ধি নাজিরশাইল চাল',
      tags: ['rice', 'aromatic', 'premium'],
      active: true
    },
    {
      id: 'onion-local',
      name: 'Local Onion',
      name_bn: 'দেশি পিঁয়াজ',
      category: 'grocery',
      subcategory: 'vegetables',
      defaultPrice: 80,
      unit: 'kg',
      defaultImage: 'https://via.placeholder.com/300x300?text=Local+Onion',
      description: 'Fresh local onion',
      description_bn: 'তাজা দেশি পিঁয়াজ',
      tags: ['vegetables', 'fresh', 'local'],
      active: true
    },
    {
      id: 'potato-local',
      name: 'Local Potato',
      name_bn: 'দেশি আলু',
      category: 'grocery',
      subcategory: 'vegetables',
      defaultPrice: 30,
      unit: 'kg',
      defaultImage: 'https://via.placeholder.com/300x300?text=Potato',
      description: 'Fresh local potato',
      description_bn: 'তাজা দেশি আলু',
      tags: ['vegetables', 'fresh', 'staple'],
      active: true
    },
    
    // Electronics
    {
      id: 'samsung-a05',
      name: 'Samsung Galaxy A05',
      name_bn: 'স্যামসাং গ্যালাক্সি এ০৫',
      category: 'electronics',
      subcategory: 'mobile',
      defaultPrice: 13500,
      unit: 'piece',
      defaultImage: 'https://via.placeholder.com/300x300?text=Samsung+A05',
      description: '4GB RAM, 64GB storage, 6.5" display',
      description_bn: '৪জিবি র‍্যাম, ৬৪জিবি স্টোরেজ, ৬.৫" ডিসপ্লে',
      tags: ['mobile', 'samsung', 'smartphone'],
      active: true
    },
    {
      id: 'xiaomi-redmi-13c',
      name: 'Xiaomi Redmi 13C',
      name_bn: 'শাওমি রেডমি ১৩সি',
      category: 'electronics',
      subcategory: 'mobile',
      defaultPrice: 12999,
      unit: 'piece',
      defaultImage: 'https://via.placeholder.com/300x300?text=Redmi+13C',
      description: '4GB RAM, 128GB storage',
      description_bn: '৪জিবি র‍্যাম, ১২৮জিবি স্টোরেজ',
      tags: ['mobile', 'xiaomi', 'budget'],
      active: true
    },
    {
      id: 'walton-primo-h9',
      name: 'Walton Primo H9',
      name_bn: 'ওয়ালটন প্রিমো এইচ৯',
      category: 'electronics',
      subcategory: 'mobile',
      defaultPrice: 9999,
      unit: 'piece',
      defaultImage: 'https://via.placeholder.com/300x300?text=Walton+H9',
      description: 'Local brand, 3GB RAM, 32GB storage',
      description_bn: 'দেশি ব্র্যান্ড, ৩জিবি র‍্যাম, ৩২জিবি স্টোরেজ',
      tags: ['mobile', 'walton', 'local'],
      active: true
    }
  ]

  const batch = writeBatch(db)

  for (const product of products) {
    const productRef = doc(db, 'catalogProducts', product.id)
    batch.set(productRef, {
      ...product,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    })
  }

  await batch.commit()
  console.log(`✅ Seeded ${products.length} catalog products`)
}

/**
 * Helper: Get last 7 days in YYYY-MM-DD format
 */
function getLast7Days() {
  const dates = []
  for (let i = 6; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    dates.push(date.toISOString().split('T')[0])
  }
  return dates
}

/**
 * Seed sample data to Firestore
 * Run this once to populate the database
 */
export async function seedFirestore() {
  console.log('🌱 Starting Firestore seed...')
  
  try {
    await seedUsers()
    await seedListings()
    await seedAnalytics()
    await seedCatalog()
    await seedCatalogProducts()
    
    console.log('✅ Firestore seed complete!')
    return { success: true }
  } catch (error) {
    console.error('❌ Seed failed:', error)
    throw error
  }
}

/**
 * Clear all seeded data (use carefully!)
 */
export async function clearSeedData() {
  console.warn('⚠️ This will delete all seed data!')
  // Implementation left empty for safety
  // Add manual deletion code if needed
}