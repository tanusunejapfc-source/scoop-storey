import fs from 'fs';
import path from 'path';

const ALLOWED_FOLDERS = new Set([
  'uploads',
  'products',
  'payments',
  'reels',
  'reviews',
  'categories'
]);

const ALLOWED_MIME_EXTENSIONS = {
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'video/mp4': 'mp4',
  'video/webm': 'webm',
  'video/quicktime': 'mov'
};

export function resolveUploadRoot() {
  if (process.env.UPLOAD_DIR) {
    return path.resolve(process.env.UPLOAD_DIR);
  }
  if (process.env.RAILWAY_VOLUME_MOUNT_PATH) {
    return path.join(path.resolve(process.env.RAILWAY_VOLUME_MOUNT_PATH), 'uploads');
  }
  if (fs.existsSync('/data')) {
    return '/data/uploads';
  }
  return path.resolve(process.cwd(), 'uploads');
}

export function hasPersistentVolume() {
  return Boolean(
    process.env.UPLOAD_DIR ||
    process.env.RAILWAY_VOLUME_MOUNT_PATH ||
    fs.existsSync('/data')
  );
}

export function ensureUploadRoot() {
  const root = resolveUploadRoot();
  if (!fs.existsSync(root)) {
    fs.mkdirSync(root, { recursive: true });
  }
  for (const folder of ALLOWED_FOLDERS) {
    const dir = path.join(root, folder);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }
  return root;
}

export function sanitizeFolder(folder) {
  const clean = String(folder || 'uploads').toLowerCase().trim();
  return ALLOWED_FOLDERS.has(clean) ? clean : 'uploads';
}

export function sanitizeBaseName(name) {
  const clean = String(name || 'media')
    .replace(/\.[^/.]+$/, '')
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60);
  return clean || 'media';
}

export function resolveSafeExtension(mimetype, originalName = '') {
  const mime = String(mimetype || '').toLowerCase().split(';')[0].trim();
  if (ALLOWED_MIME_EXTENSIONS[mime]) {
    return ALLOWED_MIME_EXTENSIONS[mime];
  }
  const extMatch = String(originalName).toLowerCase().match(/\.([a-z0-9]+)$/);
  const ext = extMatch ? extMatch[1] : '';
  if (Object.values(ALLOWED_MIME_EXTENSIONS).includes(ext)) {
    return ext === 'jpeg' ? 'jpg' : ext;
  }
  return null;
}

export function saveBufferToVolume({ buffer, folder = 'uploads', baseName = 'media', extension }) {
  if (!buffer || !Buffer.isBuffer(buffer) || buffer.length === 0) {
    throw new Error('Empty file buffer');
  }
  if (!extension) {
    throw new Error('Unsupported file format');
  }

  const root = ensureUploadRoot();
  const safeFolder = sanitizeFolder(folder);
  const safeName = sanitizeBaseName(baseName);
  const uniqueSuffix = `${Date.now().toString().slice(-6)}-${Math.random().toString(36).slice(2, 6)}`;
  const filename = `${safeName}-${uniqueSuffix}.${extension}`;

  const folderDir = path.resolve(root, safeFolder);
  const destPath = path.resolve(folderDir, filename);

  // Guard against directory traversal
  if (!destPath.startsWith(folderDir + path.sep)) {
    throw new Error('Invalid destination path');
  }

  fs.writeFileSync(destPath, buffer);
  return {
    filename,
    folder: safeFolder,
    url: `/uploads/${safeFolder}/${filename}`,
    size: buffer.length
  };
}
