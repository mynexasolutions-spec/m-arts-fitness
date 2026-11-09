const fs = require('fs');
const { ALL_PRODUCTS } = require('../data/products.ts');

const tableSql = `-- ==========================================
-- 1. Create the products table
-- ==========================================
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  tagline TEXT,
  "shortDescription" TEXT,
  description TEXT,
  image TEXT NOT NULL,
  gallery JSONB DEFAULT '[]'::jsonb,
  "infographicImages" JSONB DEFAULT '[]'::jsonb,
  category TEXT NOT NULL,
  "categoryLabel" TEXT,
  badge TEXT,
  "isBestSeller" BOOLEAN DEFAULT false,
  rating NUMERIC(3, 1) DEFAULT 0,
  "reviewsCount" INTEGER DEFAULT 0,
  price NUMERIC NOT NULL,
  "originalPrice" NUMERIC,
  sku TEXT,
  "inStock" BOOLEAN DEFAULT true,
  "packInfo" TEXT,
  "optionsLabel" TEXT,
  options JSONB DEFAULT '[]'::jsonb,
  highlights JSONB DEFAULT '[]'::jsonb,
  "keyFeatures" JSONB DEFAULT '[]'::jsonb,
  specifications JSONB DEFAULT '[]'::jsonb,
  "dimensionsSummary" JSONB DEFAULT '{}'::jsonb,
  "idealFor" JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- 2. Enable Row Level Security (RLS)
-- ==========================================
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- 3. Policy: Allow anyone (anon / public) to read products
-- ==========================================
DROP POLICY IF EXISTS "Allow public read access on products" ON products;
CREATE POLICY "Allow public read access on products"
ON products
FOR SELECT
TO public
USING (true);

-- ==========================================
-- 4. Insert Initial Products
-- ==========================================
`;

function escapeSql(val) {
  if (val === null || val === undefined) return 'NULL';
  if (typeof val === 'boolean') return val ? 'TRUE' : 'FALSE';
  if (typeof val === 'number') return val.toString();
  if (typeof val === 'object') {
    return `'${JSON.stringify(val).replace(/'/g, "''")}'::jsonb`;
  }
  return `'${val.toString().replace(/'/g, "''")}'`;
}

const columns = [
  'id', 'name', 'tagline', '"shortDescription"', 'description', 'image',
  'gallery', '"infographicImages"', 'category', '"categoryLabel"',
  'badge', '"isBestSeller"', 'rating', '"reviewsCount"', 'price',
  '"originalPrice"', 'sku', '"inStock"', '"packInfo"', '"optionsLabel"',
  'options', 'highlights', '"keyFeatures"', 'specifications',
  '"dimensionsSummary"', '"idealFor"'
];

const valuesList = ALL_PRODUCTS.map(p => {
  const rowVals = [
    escapeSql(p.id),
    escapeSql(p.name),
    escapeSql(p.tagline),
    escapeSql(p.shortDescription),
    escapeSql(p.description),
    escapeSql(p.image),
    escapeSql(p.gallery),
    escapeSql(p.infographicImages || []),
    escapeSql(p.category),
    escapeSql(p.categoryLabel),
    escapeSql(p.badge),
    escapeSql(p.isBestSeller ?? false),
    escapeSql(p.rating),
    escapeSql(p.reviewsCount),
    escapeSql(p.price),
    escapeSql(p.originalPrice),
    escapeSql(p.sku),
    escapeSql(p.inStock ?? true),
    escapeSql(p.packInfo),
    escapeSql(p.optionsLabel),
    escapeSql(p.options || []),
    escapeSql(p.highlights || []),
    escapeSql(p.keyFeatures || []),
    escapeSql(p.specifications || []),
    escapeSql(p.dimensionsSummary || {}),
    escapeSql(p.idealFor || [])
  ];
  return `  (${rowVals.join(', ')})`;
}).join(',\n');

const insertSql = `INSERT INTO products (
  ${columns.join(', ')}
) VALUES
${valuesList}
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  tagline = EXCLUDED.tagline,
  "shortDescription" = EXCLUDED."shortDescription",
  description = EXCLUDED.description,
  image = EXCLUDED.image,
  gallery = EXCLUDED.gallery,
  "infographicImages" = EXCLUDED."infographicImages",
  category = EXCLUDED.category,
  "categoryLabel" = EXCLUDED."categoryLabel",
  badge = EXCLUDED.badge,
  "isBestSeller" = EXCLUDED."isBestSeller",
  rating = EXCLUDED.rating,
  "reviewsCount" = EXCLUDED."reviewsCount",
  price = EXCLUDED.price,
  "originalPrice" = EXCLUDED."originalPrice",
  sku = EXCLUDED.sku,
  "inStock" = EXCLUDED."inStock",
  "packInfo" = EXCLUDED."packInfo",
  "optionsLabel" = EXCLUDED."optionsLabel",
  options = EXCLUDED.options,
  highlights = EXCLUDED.highlights,
  "keyFeatures" = EXCLUDED."keyFeatures",
  specifications = EXCLUDED.specifications,
  "dimensionsSummary" = EXCLUDED."dimensionsSummary",
  "idealFor" = EXCLUDED."idealFor";\n`;

const fullSql = tableSql + insertSql;
fs.writeFileSync('supabase-schema.sql', fullSql, 'utf8');
console.log('Successfully wrote supabase-schema.sql (' + fullSql.length + ' bytes)');

