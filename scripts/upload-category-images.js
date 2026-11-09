const fs = require('fs');
const path = require('path');
const ImageKit = require('imagekit');

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY || process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || '',
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || '',
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || '',
});

const publicDir = path.join(__dirname, '..', 'public');

const filesToUpload = [
  'category-gym-equipment.png',
  'category-sports-accessories.png',
  'category-training-equipment.png',
  'category-fitness-essentials.png',
  'category-sports-gear.png',
  'category-agility-tools.png',
];

async function uploadCategoryFiles() {
  const uploadedUrls = {};
  for (const fileName of filesToUpload) {
    const filePath = path.join(publicDir, fileName);
    if (!fs.existsSync(filePath)) {
      console.warn(`File does not exist yet: ${filePath}`);
      continue;
    }
    const fileBuffer = fs.readFileSync(filePath);
    try {
      const res = await imagekit.upload({
        file: fileBuffer,
        fileName: fileName,
        folder: '/categories',
        useUniqueFileName: false,
      });
      console.log(`Uploaded ${fileName} -> ${res.url}`);
      uploadedUrls[fileName] = res.url;
    } catch (err) {
      console.error(`Error uploading ${fileName}:`, err.message);
    }
  }
  console.log('\nAll done! URL Map:');
  console.log(JSON.stringify(uploadedUrls, null, 2));
}

uploadCategoryFiles();

