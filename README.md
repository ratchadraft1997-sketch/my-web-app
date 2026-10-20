This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### เปิดใช้งานจากโทรศัพท์ในเครือข่ายเดียวกัน

1. เชื่อม Mac และโทรศัพท์เข้ากับ Wi-Fi เดียวกัน หรือเปิด Personal Hotspot ให้ Mac เชื่อมต่อ
2. รันคำสั่งนี้ในโฟลเดอร์โปรเจกต์:

```bash
npm run dev:phone
```

3. ดู IP ของ Mac แล้วเปิด `http://<IP-ของ-Mac>:3000` จากโทรศัพท์ เช่น `http://172.20.10.3:3000`

ห้ามใช้ `localhost:3000` บนโทรศัพท์ เพราะ `localhost` จะหมายถึงโทรศัพท์เอง หากเข้าไม่ได้ให้ตรวจว่าอุปกรณ์อยู่เครือข่ายเดียวกันและ macOS Firewall อนุญาต Node.js แล้ว

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
