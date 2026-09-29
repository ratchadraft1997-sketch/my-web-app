export interface TripBudgetSummary {
  total: number;
  spent: number;
  remaining: number;
  percent: number;
  note: string;
}

export interface TripChecklistItem {
  id: string;
  label: string;
  checked: boolean;
}

export interface TripBudgetConfig {
  total?: number;
  spent?: number;
  note?: string;
}

export function getDefaultChecklistItems(): TripChecklistItem[] {
  return [
    { id: "check-1", label: "ตรวจสอบวันเดินทางและการจองที่พัก", checked: false },
    { id: "check-2", label: "จัดกระเป๋าเครื่องใช้ส่วนตัวและยา", checked: false },
    { id: "check-3", label: "สำรองเงินสดและเช็คแผนที่นำทาง", checked: false },
    { id: "check-4", label: "แจ้งเพื่อน/ครอบครัวก่อนออกเดินทาง", checked: false },
  ];
}

export function parseBudgetValue(value?: string | number): number {
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  if (!value) return 0;

  const matches = value.match(/\d+(?:,\d{3})*(?:\.\d+)?/g);
  if (!matches || matches.length === 0) return 0;

  const normalized = matches
    .map((match) => match.replace(/,/g, ""))
    .map(Number)
    .filter((num) => Number.isFinite(num));

  return normalized.length > 0 ? Math.max(...normalized) : 0;
}

export function getTripBudgetSummary(trip: {
  estimatedBudget?: string;
  budget?: TripBudgetConfig;
}): TripBudgetSummary {
  const total = trip.budget?.total ?? parseBudgetValue(trip.estimatedBudget);
  const spent = trip.budget?.spent ?? 0;
  const remaining = Math.max(total - spent, 0);
  const percent = total > 0 ? Math.round((spent / total) * 100) : 0;

  return {
    total,
    spent,
    remaining,
    percent,
    note: trip.budget?.note || (total > 0 ? `เหลือ ${remaining.toLocaleString("th-TH")} บาท` : "ยังไม่มีข้อมูลงบประมาณ"), 
  };
}

export function buildTripShareText(trip: {
  title: string;
  duration?: string;
  estimatedBudget?: string;
  budget?: TripBudgetConfig;
  items?: Array<{ placeName?: string }>; 
}): string {
  const summary = getTripBudgetSummary(trip);
  const places = trip.items?.map((item) => item.placeName).filter(Boolean) ?? [];
  const placeText = places.length > 0 ? places.join(" • ") : "ยังไม่ได้เพิ่มสถานที่";

  const budgetText = summary.total > 0
    ? `งบประมาณรวม ${summary.total.toLocaleString("th-TH")} บาท | ใช้ไป ${summary.spent.toLocaleString("th-TH")} บาท | เหลือ ${summary.remaining.toLocaleString("th-TH")} บาท`
    : "งบประมาณ: ยังไม่ได้กำหนด";

  return [
    `📍 ${trip.title}`,
    trip.duration ? `⏱ ${trip.duration}` : "",
    budgetText,
    `📌 สถานที่ในทริป: ${placeText}`,
    "",
    "สร้างจากแอปท่องเที่ยวนครนายก",
  ].filter(Boolean).join("\n");
}
