-- ==============================================================================
-- Nakhon Nayok Trip - Database Schema & Seed Data for Supabase
-- ==============================================================================

-- 1. Create Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone" 
ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Function to handle new user registration automatically
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, role)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', 'นักเดินทาง'),
    new.raw_user_meta_data->>'avatar_url',
    'user'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile record when auth.users is created
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- 2. Create Categories Table
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  icon TEXT,
  description TEXT,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Categories are viewable by everyone" 
ON public.categories FOR SELECT USING (true);


-- 3. Create Places Table
CREATE TABLE IF NOT EXISTS public.places (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  highlight TEXT,
  cover_image TEXT NOT NULL,
  images TEXT[] DEFAULT '{}',
  address TEXT,
  district TEXT DEFAULT 'เมืองนครนายก',
  latitude NUMERIC(10, 7),
  longitude NUMERIC(10, 7),
  google_maps_url TEXT,
  opening_hours TEXT DEFAULT 'เปิดทุกวัน 08:00 - 17:00 น.',
  fee TEXT DEFAULT 'ไม่มีค่าเข้าชม',
  phone TEXT,
  is_featured BOOLEAN DEFAULT false,
  rating NUMERIC(2, 1) DEFAULT 4.8,
  review_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.places ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Places are viewable by everyone" 
ON public.places FOR SELECT USING (true);


-- ==============================================================================
-- Seed Data: Categories
-- ==============================================================================

INSERT INTO public.categories (id, name, slug, icon, description, display_order)
VALUES
  ('c1000000-0000-0000-0000-000000000001', 'น้ำตกและลำธาร', 'waterfalls', '🌊', 'น้ำตกชื่อดัง ธรรมชาติร่มรื่น เหมาะกับการเล่นน้ำและพักผ่อน', 1),
  ('c1000000-0000-0000-0000-000000000002', 'ธรรมชาติและจุดชมวิว', 'nature', '⛰️', 'เขื่อน อ่างเก็บน้ำ และจุดชมวิวทิวทัศน์ธรรมชาติสวยงาม', 2),
  ('c1000000-0000-0000-0000-000000000003', 'วัดและโบราณสถาน', 'temples', '🛕', 'ไหว้พระขอพร สักการะสิ่งศักดิ์สิทธิ์และชมสถาปัตยกรรมงดงาม', 3),
  ('c1000000-0000-0000-0000-000000000004', 'คาเฟ่และร้านอาหาร', 'cafes', '☕', 'คาเฟ่บรรยากาศดีริมน้ำ กลางทุ่งนา อาหารและเครื่องดื่มเลิศรส', 4),
  ('c1000000-0000-0000-0000-000000000005', 'กิจกรรมและผจญภัย', 'activities', '🚣', 'ล่องแก่ง ขับ ATV และกิจกรรมแอดเวนเจอร์สุดมันส์', 5)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  icon = EXCLUDED.icon,
  description = EXCLUDED.description,
  display_order = EXCLUDED.display_order;


-- ==============================================================================
-- Seed Data: Nakhon Nayok Places
-- ==============================================================================

INSERT INTO public.places (
  id,
  category_id,
  name,
  slug,
  description,
  highlight,
  cover_image,
  images,
  address,
  district,
  latitude,
  longitude,
  google_maps_url,
  opening_hours,
  fee,
  phone,
  is_featured,
  rating,
  review_count
)
VALUES
  (
    'p1000000-0000-0000-0000-000000000001',
    'c1000000-0000-0000-0000-000000000002',
    'เขาช่องลม (Greenland นครนายก)',
    'khao-chong-lom',
    'เขาช่องลม ดินแดนธรรมชาติสีเขียวขจีที่ซ่อนตัวอยู่ด้านหลังเขื่อนขุนด่านปราการชล ได้รับการขนานนามว่าเป็น สวิตเซอร์แลนด์หรือกรีนแลนด์แห่งนครนายก บรรยากาศเงียบสงบ มีธารน้ำไหลผ่านโขดหินและทุ่งหญ้าเขียวชอุ่ม การเดินทางต้องนั่งเรือหางยาวจากสันเขื่อนเข้าไป',
    'ทุ่งหญ้าเขียวขจี ลำธารใส โขดหินสวยงาม ถ่ายรูปได้ฟีลธรรมชาติสไตล์กรีนแลนด์',
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80',
    ARRAY[
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1000&q=80'
    ],
    'บริเวณด้านหลังเขื่อนขุนด่านปราการชล ต.หินตั้ง',
    'เมืองนครนายก',
    14.3168,
    101.3215,
    'https://maps.google.com/?q=14.3168,101.3215',
    'เปิดบริการเรือ 08:00 - 16:30 น. (ขึ้นอยู่กับฤดูกาลและระดับน้ำ)',
    'ค่าเรือเหมาประมาณ 1,500 บาท หรือคนละ 200 บาท (ขึ้นอยู่กับจำนวนคน)',
    '089-999-9999',
    true,
    4.9,
    142
  ),
  (
    'p1000000-0000-0000-0000-000000000002',
    'c1000000-0000-0000-0000-000000000002',
    'เขื่อนขุนด่านปราการชล',
    'khun-dan-prakarn-chon-dam',
    'เขื่อนคอนกรีตบดอัดขนาดยาวที่สุดในโลก มีความยาวรวม 2,720 เมตร สร้างขึ้นตามแนวพระราชดำริของในหลวงรัชกาลที่ 9 บนสันเขื่อนเป็นจุดชมทิวทัศน์ที่สวยงาม มองเห็นตัวเมืองนครนายกและอ่างเก็บน้ำกว้างใหญ่ มีบริการรถรางชมวิวและนั่งเรือเที่ยวต้นน้ำ',
    'จุดชมวิวสันเขื่อนสุดอลังการ นั่งรถรางชมวิว และจุดขึ้นเรือไปเขาช่องลม',
    'https://static.wixstatic.com/media/ab332b_8ce65e35df6d48e8927227907c7ab473~mv2.jpg/v1/fill/w_1920,h_1080,al_c/ab332b_8ce65e35df6d48e8927227907c7ab473~mv2.jpg',
    ARRAY[
      'https://static.wixstatic.com/media/ab332b_8ce65e35df6d48e8927227907c7ab473~mv2.jpg/v1/fill/w_1920,h_1080,al_c/ab332b_8ce65e35df6d48e8927227907c7ab473~mv2.jpg',
      'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=1000&q=80'
    ],
    'บ้านท่าด่าน ต.หินตั้ง',
    'เมืองนครนายก',
    14.3142,
    101.3210,
    'https://maps.google.com/?q=14.3142,101.3210',
    'เปิดทุกวัน 06:00 - 18:00 น.',
    'เข้าชมฟรี (มีค่าบริการรถรางคนละ 30 บาท)',
    '037-384-192',
    true,
    4.8,
    285
  ),
  (
    'p1000000-0000-0000-0000-000000000003',
    'c1000000-0000-0000-0000-000000000001',
    'น้ำตกสาริกา',
    'sarika-waterfall',
    'น้ำตกขนาดใหญ่ที่มีสายน้ำไหลตกจากหน้าผาสูงชันถึง 9 ชั้น มีแอ่งน้ำขนาดใหญ่ให้ลงเล่นน้ำได้อย่างเพลิดเพลิน บริเวณโดยรอบมีต้นไม้ร่มรื่น มีศาลเจ้าพ่อปลัดจ่างและถ้ำสาริกาที่หลวงปู่มั่น ภูริทัตโต เคยมาจำพรรษาปฏิบัติธรรม',
    'น้ำตก 9 ชั้น หน้าผาสูงตระการตา แอ่งน้ำธรรมชาติใสเย็นสบาย',
    'https://www.lovethailand.org/images/banner/content/lovethailand_banner_20250604164502.webp',
    ARRAY[
      'https://www.lovethailand.org/images/banner/content/lovethailand_banner_20250604164502.webp'
    ],
    'ต.สาริกา อ.เมือง จ.นครนายก',
    'เมืองนครนายก',
    14.3056,
    101.3005,
    'https://maps.google.com/?q=14.3056,101.3005',
    'เปิดทุกวัน 08:00 - 17:00 น.',
    'ผู้ใหญ่ 40 บาท เด็ก 20 บาท (ชาวต่างชาติ 200 บาท)',
    '037-381-601',
    true,
    4.7,
    198
  ),
  (
    'p1000000-0000-0000-0000-000000000004',
    'c1000000-0000-0000-0000-000000000001',
    'น้ำตกนางรอง',
    'nang-rong-waterfall',
    'น้ำตกขนาดกลางที่ไหลลดหลั่นเป็นชั้นๆ ผ่านโขดหินลงสู่แอ่งน้ำ บรรยากาศร่มรื่นด้วยแมกไม้นานาพันธุ์ มีสะพานแขวนและทางเดินปูนเลียบสายน้ำอย่างสะดวกสบาย เหมาะสำหรับครอบครัวมานั่งปิกนิกและพักผ่อนหย่อนใจ',
    'สะพานข้ามลำธาร โขดหินสวยงาม ทางเดินเลียบน้ำตกสะดวกสบาย',
    'https://images.unsplash.com/photo-1546587348-d12660c30c50?auto=format&fit=crop&w=1000&q=80',
    ARRAY[
      'https://images.unsplash.com/photo-1546587348-d12660c30c50?auto=format&fit=crop&w=1000&q=80'
    ],
    'ต.หินตั้ง อ.เมือง จ.นครนายก',
    'เมืองนครนายก',
    14.3312,
    101.3120,
    'https://maps.google.com/?q=14.3312,101.3120',
    'เปิดทุกวัน 08:00 - 17:00 น.',
    'ผู้ใหญ่ 20 บาท เด็ก 10 บาท',
    '037-385-310',
    false,
    4.6,
    120
  ),
  (
    'p1000000-0000-0000-0000-000000000005',
    'c1000000-0000-0000-0000-000000000001',
    'อุทยานวังตะไคร้',
    'wang-ta-krai',
    'สถานที่พักผ่อนยอดนิยมที่เต็มไปด้วยต้นไม้ใหญ่และสวนไม้ดอกไม้ประดับ มีลำธารสองสายไหลมาบรรจบกัน เหมาะสำหรับกิจกรรมล่องแก่งห่วงยาง เล่นน้ำ และสัมผัสความสดชื่นของธรรมชาติอย่างใกล้ชิด',
    'เล่นน้ำ ล่องแก่งห่วงยาง สวนพฤกษศาสตร์ร่มรื่น',
    'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1000&q=80',
    ARRAY[
      'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1000&q=80'
    ],
    'ต.สาริกา อ.เมือง จ.นครนายก',
    'เมืองนครนายก',
    14.3245,
    101.3050,
    'https://maps.google.com/?q=14.3245,101.3050',
    'เปิดทุกวัน 08:00 - 17:00 น.',
    'คนละ 20 บาท (รถยนต์คันละ 150 บาทพร้อมคนขับ)',
    '037-385-164',
    false,
    4.5,
    95
  ),
  (
    'p1000000-0000-0000-0000-000000000006',
    'c1000000-0000-0000-0000-000000000003',
    'วัดมณีวงศ์ (วังพญานาค)',
    'wat-maniwong',
    'วัดเก่าแก่ที่มีชื่อเสียงอย่างมากในจังหวัดนครนายก โดดเด่นด้วยวิหารพระรัตนมณีมหาบรมจักรพรรดิและ "ถ้ำพญานาคเมืองบาดาล" สุดวิจิตรตระการตา ภายในจำลองเมืองบาดาลที่มีรูปปั้นพญานาคกว่า 1,000 ตน พร้อมแสงสีเสียงงดงาม',
    'ถ้ำพญานาคจำลองเมืองบาดาลสุดอลังการ พระพุทธรูปทองคำ และสถาปัตยกรรมวิจิตร',
    'https://www.touronthai.com/uploads/2022-07/1656996513.jpg',
    ARRAY[
      'https://www.touronthai.com/uploads/2022-07/1656996513.jpg'
    ],
    'ต.ดงละคร อ.เมือง จ.นครนายก',
    'เมืองนครนายก',
    14.1750,
    101.2180,
    'https://maps.google.com/?q=14.1750,101.2180',
    'เปิดทุกวัน 07:00 - 17:30 น.',
    'เข้าชมฟรี',
    '087-133-1456',
    true,
    4.9,
    310
  ),
  (
    'p1000000-0000-0000-0000-000000000007',
    'c1000000-0000-0000-0000-000000000003',
    'วัดจุฬาภรณ์วนาราม (ซุ้มป่าไผ่)',
    'wat-chulaphorn-wanaram',
    'วัดที่มีบรรยากาศร่มรื่น สงบเงียบ ไฮไลท์สำคัญคือ "อุโมงค์ต้นไผ่" หรือซุ้มป่าไผ่ธรรมชาติที่โน้มกิ่งเข้าหากันเป็นทางยาวคล้ายกับป่าไผ่อาราชิยามะในประเทศญี่ปุ่น เหมาะแก่การมาทำบุญและถ่ายภาพสวยๆ',
    'อุโมงค์ป่าไผ่ธรรมชาติทอดยาว ถ่ายรูปสไตล์ญี่ปุ่น และทำบุญไหว้พระ',
    'https://mthai.com/app/uploads/2024/05/06nont_chulaporn_temple-600x400.jpg',
    ARRAY[
      'https://mthai.com/app/uploads/2024/05/06nont_chulaporn_temple-600x400.jpg'
    ],
    'ต.บ้านพริก อ.บ้านนา จ.นครนายก',
    'บ้านนา',
    14.2460,
    101.0710,
    'https://maps.google.com/?q=14.2460,101.0710',
    'เปิดทุกวัน 07:00 - 18:00 น.',
    'เข้าชมฟรี',
    '080-011-3791',
    true,
    4.7,
    165
  ),
  (
    'p1000000-0000-0000-0000-000000000008',
    'c1000000-0000-0000-0000-000000000002',
    'อ่างเก็บน้ำห้วยปรือ',
    'huai-prue-reservoir',
    'อ่างเก็บน้ำขนาดเล็กที่มีทิวทัศน์สวยงาม โอบล้อมด้วยภูเขาเขียวชอุ่ม อากาศสดชื่น เหมาะสำหรับเป็นจุดชมวิวพระอาทิตย์ขึ้นยามเช้า ปั่นจักรยาน วิ่งออกกำลังกาย และถ่ายภาพบรรยากาศสะท้อนผิวน้ำ',
    'วิวทะเลสาบโอบล้อมด้วยทิวเขา บรรยากาศเงียบสงบ ชมหมอกและพระอาทิตย์ขึ้น',
    'https://images.unsplash.com/photo-1439066615861-d1af74d74000?auto=format&fit=crop&w=1000&q=80',
    ARRAY[
      'https://images.unsplash.com/photo-1439066615861-d1af74d74000?auto=format&fit=crop&w=1000&q=80'
    ],
    'ต.เขาพระ อ.เมือง จ.นครนายก',
    'เมืองนครนายก',
    14.3015,
    101.2420,
    'https://maps.google.com/?q=14.3015,101.2420',
    'เปิดทุกวัน 06:00 - 18:00 น.',
    'เข้าชมฟรี',
    '037-312-282',
    false,
    4.8,
    88
  ),
  (
    'p1000000-0000-0000-0000-000000000009',
    'c1000000-0000-0000-0000-000000000004',
    'เอเดนฟาร์ม (Aden Farm)',
    'aden-farm',
    'คาเฟ่และแหล่งท่องเที่ยวเชิงเกษตร บรรยากาศทุ่งนาเขียวขจี โดดเด่นด้วยสะพานไม้ไผ่ทอดยาวกลางทุ่ง มีร่มหลากสีสันห้อยประดับตกแต่ง พร้อมเมนูอาหาร เครื่องดื่ม กาแฟ และมุมถ่ายรูปเช็คอินมากมาย',
    'สะพานไม้ไผ่กลางทุ่งนา ร่มสีสันสดใส อาหารเครื่องดื่มครบครัน',
    'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1000&q=80',
    ARRAY[
      'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1000&q=80'
    ],
    'ต.บัวลอย อ.หนองแค (ใกล้เขตนครนายก) / เส้นรังสิต-นครนายก',
    'เมืองนครนายก',
    14.2120,
    101.1250,
    'https://maps.google.com/?q=14.2120,101.1250',
    'เปิดทุกวัน 09:00 - 19:00 น.',
    'เข้าชมฟรี (อุดหนุนเครื่องดื่ม/อาหาร)',
    '081-375-0343',
    false,
    4.6,
    115
  )
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  highlight = EXCLUDED.highlight,
  cover_image = EXCLUDED.cover_image,
  images = EXCLUDED.images,
  address = EXCLUDED.address,
  district = EXCLUDED.district,
  latitude = EXCLUDED.latitude,
  longitude = EXCLUDED.longitude,
  google_maps_url = EXCLUDED.google_maps_url,
  opening_hours = EXCLUDED.opening_hours,
  fee = EXCLUDED.fee,
  phone = EXCLUDED.phone,
  is_featured = EXCLUDED.is_featured,
  rating = EXCLUDED.rating,
  review_count = EXCLUDED.review_count;

-- Safety services are intentionally included in the same directory as attractions,
-- so travellers can find a nearby service and open its Google Maps route quickly.
INSERT INTO public.categories (id, name, slug, icon, description, display_order)
VALUES
  ('c1000000-0000-0000-0000-000000000006', 'โรงพยาบาลและสาธารณสุข', 'hospitals', '🏥', 'โรงพยาบาลและหน่วยบริการฉุกเฉิน', 6),
  ('c1000000-0000-0000-0000-000000000007', 'สถานีตำรวจและความปลอดภัย', 'police', '👮', 'สถานีตำรวจและจุดบริการความปลอดภัย', 7)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  icon = EXCLUDED.icon,
  description = EXCLUDED.description,
  display_order = EXCLUDED.display_order;

INSERT INTO public.places (
  id, category_id, name, slug, description, highlight, cover_image, images,
  address, district, latitude, longitude, google_maps_url, opening_hours, fee,
  phone, is_featured, rating, review_count
)
VALUES
  (
    'p1000000-0000-0000-0000-000000000020',
    'c1000000-0000-0000-0000-000000000006',
    'โรงพยาบาลนครนายก', 'nakhon-nayok-hospital',
    'โรงพยาบาลทั่วไปประจำจังหวัดนครนายก มีแผนกอุบัติเหตุและฉุกเฉินสำหรับผู้ป่วยเร่งด่วน',
    'ติดต่อรถพยาบาลฉุกเฉินทั่วประเทศ โทร 1669',
    'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=1000&q=80',
    ARRAY['https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=1000&q=80'],
    '1-100 ถนนสุวรรณศร อ.เมือง จ.นครนายก 26000', 'เมืองนครนายก',
    14.2080, 101.2150, 'https://maps.google.com/?q=14.2080,101.2150',
    'แผนกฉุกเฉินเปิด 24 ชั่วโมง', 'ตามสิทธิการรักษา', '037-312-440', true, 4.5, 85
  ),
  (
    'p1000000-0000-0000-0000-000000000030',
    'c1000000-0000-0000-0000-000000000007',
    'สถานีตำรวจภูธรเมืองนครนายก (สภ.เมืองนครนายก)', 'mueang-nakhon-nayok-police-station',
    'สถานีตำรวจในเขตเมืองนครนายก สำหรับติดต่อราชการและประสานงานในพื้นที่',
    'เหตุด่วนเหตุร้าย โทร 191 ตลอด 24 ชั่วโมง',
    'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1000&q=80',
    ARRAY['https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1000&q=80'],
    'ถนนเสนาพินิจ ต.นครนายก อ.เมือง จ.นครนายก 26000', 'เมืองนครนายก',
    14.2050, 101.2120, 'https://maps.google.com/?q=14.2050,101.2120',
    'เปิดบริการตลอด 24 ชั่วโมง', 'ไม่มีค่าบริการ', '037-311-285', true, 4.6, 65
  )
ON CONFLICT (slug) DO UPDATE SET
  category_id = EXCLUDED.category_id,
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  highlight = EXCLUDED.highlight,
  cover_image = EXCLUDED.cover_image,
  images = EXCLUDED.images,
  address = EXCLUDED.address,
  district = EXCLUDED.district,
  latitude = EXCLUDED.latitude,
  longitude = EXCLUDED.longitude,
  google_maps_url = EXCLUDED.google_maps_url,
  opening_hours = EXCLUDED.opening_hours,
  fee = EXCLUDED.fee,
  phone = EXCLUDED.phone,
  is_featured = EXCLUDED.is_featured;
