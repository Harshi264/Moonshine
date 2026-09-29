import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
      const body = await request.json();
      const { base64, filename } = body;

      if (!base64) {
        return NextResponse.json({ success: false, error: 'No image data provided' }, { status: 400 });
      }

      // If already an HTTP/HTTPS URL, return as is
      if (base64.startsWith('http://') || base64.startsWith('https://')) {
        return NextResponse.json({ success: true, url: base64 });
      }

      // Decode base64 and save to public/uploads/
      const match = base64.match(/^data:image\/([a-zA-Z0-9]+);base64,(.+)$/);
      const ext = match ? match[1] : 'jpg';
      const dataBuffer = match ? Buffer.from(match[2], 'base64') : Buffer.from(base64, 'base64');

      const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      const uniqueName = `img_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${ext}`;
      const filePath = path.join(uploadsDir, uniqueName);
      fs.writeFileSync(filePath, dataBuffer);

      return NextResponse.json({ success: true, url: `/uploads/${uniqueName}` });
    } else {
      // Handle FormData upload
      const formData = await request.formData();
      const file = formData.get('file') as File;

      if (!file) {
        return NextResponse.json({ success: false, error: 'No file uploaded' }, { status: 400 });
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      const ext = file.name.split('.').pop() || 'png';
      const uniqueName = `img_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${ext}`;
      const filePath = path.join(uploadsDir, uniqueName);
      fs.writeFileSync(filePath, buffer);

      return NextResponse.json({ success: true, url: `/uploads/${uniqueName}` });
    }
  } catch (err: any) {
    console.error('Upload error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
