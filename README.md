# Nakhon Nayok Trip

เว็บแอปสำรวจสถานที่ท่องเที่ยวและวางแผนทริปในจังหวัดนครนายก สร้างด้วย Next.js และ Supabase

## เริ่มพัฒนาในเครื่อง

ต้องใช้ Node.js และ npm จากนั้นติดตั้ง dependencies:

```bash
npm install
```

สร้างไฟล์ `.env.local` ที่ root ของโปรเจกต์:

```env
NEXT_PUBLIC_SUPABASE_URL=https://<project-id>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<publishable-or-anon-key>
```

ใช้ Supabase **Publishable key** หรือ `anon` key เท่านั้น ห้ามใช้ `Secret key` หรือ `service_role` key ในแอปฝั่งเว็บ และห้าม commit ไฟล์ `.env.local`

รันเซิร์ฟเวอร์พัฒนา:

```bash
npm run dev
```

เปิด [http://localhost:3000](http://localhost:3000)

เปิดทดสอบจากโทรศัพท์ที่อยู่ Wi-Fi เดียวกัน:

```bash
npm run dev:phone
```

จากนั้นเปิด `http://<IP-ของ-Mac>:3000` บนโทรศัพท์

## ตรวจสอบก่อนเผยแพร่

```bash
npm run lint
npm test
npm run build
```

## เผยแพร่และอัปเดตเว็บไซต์

โปรเจกต์ Vercel `app-in-nayok` เชื่อมกับ GitHub repository `ratchadraft1997-sketch/my-web-app` และ branch `main` แล้ว

1. แก้โค้ดและทดสอบในเครื่อง
2. ตรวจ lint และ production build ด้วยคำสั่งด้านบน
3. commit และ push ไป `main`:

   ```bash
   git add <ไฟล์ที่แก้>
   git commit -m "Describe your change"
   git push
   ```

4. Vercel จะ build และ deploy เวอร์ชันใหม่จาก `main` อัตโนมัติ ไม่ต้องสร้างโปรเจกต์หรือกรอก environment variables ใหม่ทุกครั้ง
5. ตรวจสถานะและ build log ที่ [Vercel Deployments](https://vercel.com/ratchadraft1997-sketch/app-in-nayok/deployments) เมื่อสถานะเป็น **Ready** จึงเปิดเว็บไซต์ได้

การ push ไป branch อื่นจะสร้าง Preview Deployment ส่วน Production ใช้ branch `main`

ตั้งค่า Environment Variables ของ Production ใน Vercel ที่ **Project Settings → Environment Variables** โดยต้องมี:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` (ใช้ Publishable key หรือ `anon` key)

ถ้าเปลี่ยน Environment Variables ให้สั่ง Redeploy เพื่อให้ build ใหม่รับค่าเหล่านั้น

## Supabase

- ตั้งค่า Google OAuth และ callback URL ตาม [SUPABASE_OAUTH_SETUP.md](./SUPABASE_OAUTH_SETUP.md)
- Schema และ seed data อยู่ที่ [supabase/schema.sql](./supabase/schema.sql)
- ทริปส่วนตัว รายการโปรด และบันทึกการเดินทางบางส่วนเก็บใน browser `localStorage` จึงยังไม่ซิงก์ข้ามอุปกรณ์หรือบัญชีผู้ใช้

## คำสั่งที่ใช้บ่อย

| คำสั่ง | รายละเอียด |
| --- | --- |
| `npm run dev` | เปิดเซิร์ฟเวอร์พัฒนา |
| `npm run dev:phone` | เปิดเซิร์ฟเวอร์ให้โทรศัพท์ในเครือข่ายเดียวกันเข้าถึง |
| `npm run lint` | ตรวจรูปแบบและปัญหาด้วย ESLint |
| `npm test` | รันชุดทดสอบ |
| `npm run build` | สร้าง production build |
| `npm run start` | เปิด production build ในเครื่อง |
