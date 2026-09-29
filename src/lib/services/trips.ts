import { TripPlan } from "@/types/trip";

export const CURATED_TRIPS: TripPlan[] = [
  {
    id: "curated-khao-chong-lom-daytrip",
    title: "Day Trip 1 วัน: สัมผัสกรีนแลนด์นครนายก & ล่องเรือเขาช่องลม",
    description:
      "ทริปยอดนิยมอันดับ 1 เที่ยวรับลมชมวิวสันเขื่อนขุนด่าน ล่องเรือลุยทุ่งหญ้าเขียวขจีเขาช่องลม แวะเล่นน้ำตกสาริกา และเช็คอินคาเฟ่ทุ่งนาเอเดนฟาร์ม",
    coverImage:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80",
    duration: "1 วัน (Day Trip)",
    tags: ["ยอดนิยม", "ธรรมชาติ", "ถ่ายรูปสวย", "Day Trip"],
    estimatedBudget: "350 - 550 บาท / คน",
    bestTimeToVisit: "มิถุนายน - พฤศจิกายน (ทุ่งหญ้าและลำธารเขียวชอุ่มที่สุด)",
    isCurated: true,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
    items: [
      {
        id: "c-item-1",
        placeId: "p1000000-0000-0000-0000-000000000002",
        placeSlug: "khun-dan-prakarn-chon-dam",
        placeName: "เขื่อนขุนด่านปราการชล",
        coverImage:
          "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80",
        categoryName: "ธรรมชาติและจุดชมวิว",
        categoryIcon: "⛰️",
        district: "เมืองนครนายก",
        timeSlot: "08:30 น.",
        note: "ชมวิวสันเขื่อนยามเช้า อากาศกำลังสบาย และเตรียมตัวซื้อตั๋วเรือ",
        visited: false,
        googleMapsUrl: "https://maps.google.com/?q=14.3142,101.3210",
      },
      {
        id: "c-item-2",
        placeId: "p1000000-0000-0000-0000-000000000001",
        placeSlug: "khao-chong-lom",
        placeName: "เขาช่องลม (Greenland นครนายก)",
        coverImage:
          "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80",
        categoryName: "ธรรมชาติและจุดชมวิว",
        categoryIcon: "⛰️",
        district: "เมืองนครนายก",
        timeSlot: "09:30 น.",
        note: "นั่งเรือหางยาวเข้าไป เดินถ่ายรูปตามโขดหินและทุ่งหญ้าเขียว แนะนำรองเท้าที่เดินสะดวก",
        visited: false,
        googleMapsUrl: "https://maps.google.com/?q=14.3168,101.3215",
      },
      {
        id: "c-item-3",
        placeId: "p1000000-0000-0000-0000-000000000003",
        placeSlug: "sarika-waterfall",
        placeName: "น้ำตกสาริกา",
        coverImage:
          "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=1000&q=80",
        categoryName: "น้ำตกและลำธาร",
        categoryIcon: "🌊",
        district: "เมืองนครนายก",
        timeSlot: "13:00 น.",
        note: "พักทานอาหารกลางวันหน้าทางเข้าน้ำตก และเดินขึ้นชมน้ำตก 9 ชั้นสัมผัสละอองน้ำเย็นสดชื่น",
        visited: false,
        googleMapsUrl: "https://maps.google.com/?q=14.3056,101.3005",
      },
      {
        id: "c-item-4",
        placeId: "p1000000-0000-0000-0000-000000000009",
        placeSlug: "aden-farm",
        placeName: "เอเดนฟาร์ม (Aden Farm)",
        coverImage:
          "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1000&q=80",
        categoryName: "คาเฟ่และร้านอาหาร",
        categoryIcon: "☕",
        district: "เมืองนครนายก",
        timeSlot: "15:45 น.",
        note: "แวะดื่มกาแฟเย็นๆ เดินเล่นสะพานไม้ไผ่กลางทุ่งนา ถ่ายรูปกับร่มสีสันก่อนเดินทางกลับ",
        visited: false,
        googleMapsUrl: "https://maps.google.com/?q=14.2120,101.1250",
      },
    ],
  },
  {
    id: "curated-sacred-temples-daytrip",
    title: "Day Trip 1 วัน: ไหว้พระเสริมสิริมงคล & ซุ้มป่าไผ่สไตล์ญี่ปุ่น",
    description:
      "ทริปสายบุญและสายถ่ายรูป เดินลอดซุ้มป่าไผ่วัดจุฬาภรณ์วนาราม ชมถ้ำพญานาคสุดอลังการวัดมณีวงศ์ และชมวิวพระอาทิตย์ตกที่อ่างเก็บน้ำห้วยปรือ",
    coverImage:
      "https://images.unsplash.com/photo-1528181304800-259b08848526?auto=format&fit=crop&w=1000&q=80",
    duration: "1 วัน (Day Trip)",
    tags: ["สายมู", "ไหว้พระ", "ครอบครัว", "ถ่ายรูปสวย"],
    estimatedBudget: "150 - 300 บาท / คน",
    bestTimeToVisit: "ตลอดทั้งปี (แนะนำช่วงเช้าและเย็น แดดไม่ร้อน)",
    isCurated: true,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
    items: [
      {
        id: "c-item-21",
        placeId: "p1000000-0000-0000-0000-000000000007",
        placeSlug: "wat-chulaphorn-wanaram",
        placeName: "วัดจุฬาภรณ์วนาราม (ซุ้มป่าไผ่)",
        coverImage:
          "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1000&q=80",
        categoryName: "วัดและโบราณสถาน",
        categoryIcon: "🛕",
        district: "บ้านนา",
        timeSlot: "09:00 น.",
        note: "ทำบุญไหว้พระ และเดินถ่ายภาพบรรยากาศร่มรื่นในอุโมงค์ป่าไผ่ฟีลญี่ปุ่น",
        visited: false,
        googleMapsUrl: "https://maps.google.com/?q=14.2460,101.0710",
      },
      {
        id: "c-item-22",
        placeId: "p1000000-0000-0000-0000-000000000006",
        placeSlug: "wat-maniwong",
        placeName: "วัดมณีวงศ์ (วังพญานาค)",
        coverImage:
          "https://images.unsplash.com/photo-1528181304800-259b08848526?auto=format&fit=crop&w=1000&q=80",
        categoryName: "วัดและโบราณสถาน",
        categoryIcon: "🛕",
        district: "เมืองนครนายก",
        timeSlot: "11:30 น.",
        note: "กราบสักการะองค์พญานาค และชมความวิจิตรของถ้ำเมืองบาดาลจำลองนับพันองค์",
        visited: false,
        googleMapsUrl: "https://maps.google.com/?q=14.1750,101.2180",
      },
      {
        id: "c-item-23",
        placeId: "p1000000-0000-0000-0000-000000000008",
        placeSlug: "huai-prue-reservoir",
        placeName: "อ่างเก็บน้ำห้วยปรือ",
        coverImage:
          "https://images.unsplash.com/photo-1439066615861-d1af74d74000?auto=format&fit=crop&w=1000&q=80",
        categoryName: "ธรรมชาติและจุดชมวิว",
        categoryIcon: "⛰️",
        district: "เมืองนครนายก",
        timeSlot: "16:00 น.",
        note: "รับลมเย็นริมอ่างเก็บน้ำ ชมวิวภูเขาสะท้อนน้ำยามเย็น เหมาะแก่การพักผ่อนและถ่ายรูปชิลๆ",
        visited: false,
        googleMapsUrl: "https://maps.google.com/?q=14.3015,101.2420",
      },
    ],
  },
  {
    id: "curated-nature-adventure-2days",
    title: "2 วัน 1 คืน: เที่ยวชิล ล่องแก่ง สัมผัสน้ำตกนครนายก",
    description:
      "แพลนเที่ยวแบบเต็มอิ่ม 2 วัน 1 คืน เล่นน้ำตก ล่องแก่งห่วงยางที่วังตะไคร้ และตื่นเช้าไปชมหมอกเขาช่องลม",
    coverImage:
      "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1000&q=80",
    duration: "2 วัน 1 คืน",
    tags: ["2 วัน 1 คืน", "แอดเวนเจอร์", "ล่องแก่ง", "ธรรมชาติ"],
    estimatedBudget: "1,200 - 2,000 บาท / คน (รวมที่พัก)",
    bestTimeToVisit: "สิงหาคม - ธันวาคม",
    isCurated: true,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
    items: [
      {
        id: "c-item-31",
        placeId: "p1000000-0000-0000-0000-000000000004",
        placeSlug: "nang-rong-waterfall",
        placeName: "น้ำตกนางรอง",
        coverImage:
          "https://images.unsplash.com/photo-1546587348-d12660c30c50?auto=format&fit=crop&w=1000&q=80",
        categoryName: "น้ำตกและลำธาร",
        categoryIcon: "🌊",
        district: "เมืองนครนายก",
        timeSlot: "วันที่ 1 - 10:30 น.",
        note: "เดินข้ามสะพานแขวนและเล่นน้ำตกเบาๆ บรรยากาศร่มรื่น",
        visited: false,
        googleMapsUrl: "https://maps.google.com/?q=14.3312,101.3120",
      },
      {
        id: "c-item-32",
        placeId: "p1000000-0000-0000-0000-000000000005",
        placeSlug: "wang-ta-krai",
        placeName: "อุทยานวังตะไคร้",
        coverImage:
          "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1000&q=80",
        categoryName: "น้ำตกและลำธาร",
        categoryIcon: "🌊",
        district: "เมืองนครนายก",
        timeSlot: "วันที่ 1 - 13:30 น.",
        note: "เช่าห่วงยางล่องแก่งตามลำน้ำวังตะไคร้ สนุกสนานสดชื่น",
        visited: false,
        googleMapsUrl: "https://maps.google.com/?q=14.3245,101.3050",
      },
      {
        id: "c-item-33",
        placeId: "p1000000-0000-0000-0000-000000000002",
        placeSlug: "khun-dan-prakarn-chon-dam",
        placeName: "เขื่อนขุนด่านปราการชล",
        coverImage:
          "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80",
        categoryName: "ธรรมชาติและจุดชมวิว",
        categoryIcon: "⛰️",
        district: "เมืองนครนายก",
        timeSlot: "วันที่ 2 - 08:00 น.",
        note: "ตื่นเช้าชมหมอกเหนืออ่างเก็บน้ำบนสันเขื่อน",
        visited: false,
        googleMapsUrl: "https://maps.google.com/?q=14.3142,101.3210",
      },
      {
        id: "c-item-34",
        placeId: "p1000000-0000-0000-0000-000000000001",
        placeSlug: "khao-chong-lom",
        placeName: "เขาช่องลม (Greenland นครนายก)",
        coverImage:
          "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80",
        categoryName: "ธรรมชาติและจุดชมวิว",
        categoryIcon: "⛰️",
        district: "เมืองนครนายก",
        timeSlot: "วันที่ 2 - 09:30 น.",
        note: "ลงเรือไปสัมผัสความงามของเขาช่องลมช่วงเช้า แดดไม่ร้อนและคนยังไม่เยอะ",
        visited: false,
        googleMapsUrl: "https://maps.google.com/?q=14.3168,101.3215",
      },
    ],
  },
];

export function getCuratedTrips(): TripPlan[] {
  return CURATED_TRIPS;
}

export function getCuratedTripById(id: string): TripPlan | null {
  return CURATED_TRIPS.find((trip) => trip.id === id) || null;
}

export function generateGoogleMapsRouteUrl(items: { googleMapsUrl?: string; placeName: string }[]): string {
  if (!items || items.length === 0) return "https://maps.google.com";

  // Extract coordinates or names
  const destinations = items.map((item) => {
    if (item.googleMapsUrl && item.googleMapsUrl.includes("?q=")) {
      return item.googleMapsUrl.split("?q=")[1];
    }
    return encodeURIComponent(item.placeName + " นครนายก");
  });

  if (destinations.length === 1) {
    return `https://www.google.com/maps/search/?api=1&query=${destinations[0]}`;
  }

  const origin = destinations[0];
  const destination = destinations[destinations.length - 1];
  const waypoints = destinations.slice(1, -1).join("|");

  let url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}`;
  if (waypoints) {
    url += `&waypoints=${waypoints}`;
  }
  return url;
}

