const fs = require('fs');
const path = require('path');
const ImageKit = require('imagekit');
const { createClient } = require('@supabase/supabase-js');

// Load environment credentials
const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY || process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || '',
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || '',
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || '',
});

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseSecret = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY || '';
const supabase = createClient(supabaseUrl, supabaseSecret);

const publicDir = path.join(__dirname, '..', 'public');

// List of all image assets to upload
const imageFiles = [
  'wooden-dumbells.jpg',
  'dumbbells-info-1.jpg',
  'dumbbells-info-2.jpg',
  'Training-cones.jpg',
  'training-cones-info.jpg',
  'Skipping-rope.jpg',
  'skipping-rope-info.jpg',
  'Yoga-mat.jpg',
  'yoga-mat-info.jpg',
  'Gym-Equipment.jpg',
  'Agility-tools.jpg',
  'Fitness-Essentials.jpg',
  'Fitness-lifestyle-16-9.jpg',
  'GymEssentials.jpg',
  'Hero-16-9.jpg',
  'Hero-mobile-9-16.jpg',
  'Hero4ratio5.jpg',
  'Lifestyle4ratio5.jpg',
  'Sports-Acessories.jpg',
  'Sports-collection.jpg',
  'Sports-gear.jpg',
  'Stay-Updated-4-3.jpg',
  'Stay-Updated.jpg',
  'Training-Equipment.jpg',
  'Yoga-wellness.jpg',
  'logo.jpg',
  'logo.png',
];

async function uploadFile(fileName) {
  const filePath = path.join(publicDir, fileName);
  if (!fs.existsSync(filePath)) {
    console.warn(`File not found: ${filePath}`);
    return null;
  }
  const fileBuffer = fs.readFileSync(filePath);
  try {
    const res = await imagekit.upload({
      file: fileBuffer,
      fileName: fileName,
      folder: '/products',
      useUniqueFileName: false,
    });
    console.log(`Uploaded to ImageKit: ${fileName} -> ${res.url}`);
    return res.url;
  } catch (err) {
    console.error(`Error uploading ${fileName}:`, err.message);
    return null;
  }
}

async function main() {
  console.log('--- Step 1: Uploading images to ImageKit ---');
  const urlMap = {};
  for (const file of imageFiles) {
    const url = await uploadFile(file);
    if (url) {
      // Map both with and without leading slash
      urlMap[file] = url;
      urlMap[`/${file}`] = url;
    }
  }

  console.log('\n--- Step 2: Updating Supabase products table with ImageKit URLs ---');
  const { data: products, error } = await supabase.from('products').select('*');
  if (error || !products) {
    console.error('Failed to fetch products from Supabase:', error);
    return;
  }

  for (const product of products) {
    const newImage = urlMap[product.image] || product.image;
    const newGallery = (product.gallery || []).map((img) => urlMap[img] || img);
    const newInfographics = (product.infographicImages || []).map(
      (img) => urlMap[img] || img
    );

    const { error: updateError } = await supabase
      .from('products')
      .update({
        image: newImage,
        gallery: newGallery,
        infographicImages: newInfographics,
      })
      .eq('id', product.id);

    if (updateError) {
      console.error(`Failed to update product ${product.id}:`, updateError.message);
    } else {
      console.log(`Updated product in Supabase: ${product.id}`);
      console.log(`  Main Image: ${newImage}`);
      console.log(`  Gallery: ${newGallery.length} items`);
    }
  }

  console.log('\n--- Sync Complete! ---');
}

main().catch(console.error);

