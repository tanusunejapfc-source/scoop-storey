import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import fs from 'fs'
import path from 'path'

function adminDevApiPlugin() {
  return {
    name: 'admin-dev-api',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url === '/api/dev/upload-image' && req.method === 'POST') {
          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', () => {
            try {
              const { name, dataUrl } = JSON.parse(body);
              if (!dataUrl || !name) {
                res.statusCode = 400;
                res.end(JSON.stringify({ error: 'Missing name or dataUrl' }));
                return;
              }

              const match = dataUrl.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/);
              if (!match) {
                res.statusCode = 400;
                res.end(JSON.stringify({ error: 'Invalid dataUrl format' }));
                return;
              }

              const ext = match[1] === 'jpeg' ? 'jpg' : match[1];
              const base64Data = match[2];
              const buffer = Buffer.from(base64Data, 'base64');

              const uploadsDir = path.resolve(process.cwd(), 'public/images/uploads');
              if (!fs.existsSync(uploadsDir)) {
                fs.mkdirSync(uploadsDir, { recursive: true });
              }

              const sanitizedName = name
                .toLowerCase()
                .replace(/[^a-z0-9_-]/g, '-')
                .replace(/-+/g, '-')
                .replace(/^-|-$/g, '');
              const filename = `${sanitizedName || 'image'}-${Date.now().toString().slice(-6)}.${ext}`;
              const filePath = path.join(uploadsDir, filename);

              fs.writeFileSync(filePath, buffer);

              const publicUrl = `/images/uploads/${filename}`;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true, url: publicUrl }));
            } catch (err) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: err.message }));
            }
          });
          return;
        }

        if (req.url === '/api/dev/save-storedata' && req.method === 'POST') {
          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', () => {
            try {
              const { products } = JSON.parse(body);
              if (!Array.isArray(products)) {
                res.statusCode = 400;
                res.end(JSON.stringify({ error: 'Expected products array' }));
                return;
              }

              const storeDataPath = path.resolve(process.cwd(), 'src/data/storeData.js');
              let content = fs.readFileSync(storeDataPath, 'utf8');

              // Format clean products array
              const cleanProducts = products.map(p => ({
                id: p.id,
                name: p.name,
                category: p.category,
                badge: p.badge || '',
                priceINR: Number(p.priceINR) || 0,
                image: p.image || '/images/bracelets-anklets.jpg',
                description: p.description || '',
                includes: Array.isArray(p.includes) ? p.includes : []
              }));

              const productsCode = `export const PRODUCTS = ${JSON.stringify(cleanProducts, null, 2)};\n`;

              // Replace between `export const PRODUCTS = [` and the ending `];`
              const regex = /export const PRODUCTS = \[\s*[\s\S]*?\n\];/;
              if (regex.test(content)) {
                content = content.replace(regex, productsCode.trim());
                fs.writeFileSync(storeDataPath, content, 'utf8');
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: true, count: cleanProducts.length }));
              } else {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: 'Could not locate PRODUCTS export in storeData.js' }));
              }
            } catch (err) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: err.message }));
            }
          });
          return;
        }

        next();
      });
    }
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    adminDevApiPlugin()
  ],
})
