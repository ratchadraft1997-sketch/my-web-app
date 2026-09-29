import assert from "node:assert/strict";
import { buildTripShareText, getTripBudgetSummary, getDefaultChecklistItems } from "./trip-planning";

const trip = {
  title: "ทริปสายน้ำตก",
  duration: "1 วัน",
  estimatedBudget: "500 บาท",
  items: [
    { placeName: "น้ำตกสาริกา" },
    { placeName: "เขาช่องลม" },
  ],
  budget: { total: 1200, spent: 650, note: "ยังเหลือ" },
  checklist: { items: [{ id: "1", label: "เตรียมกระเป๋า", checked: true }] },
};

const shareText = buildTripShareText(trip as unknown as Parameters<typeof buildTripShareText>[0]);
assert.match(shareText, /ทริปสายน้ำตก/);
assert.match(shareText, /น้ำตกสาริกา/);
assert.match(shareText, /เหลือ 550 บาท/);

const summary = getTripBudgetSummary(trip as unknown as Parameters<typeof getTripBudgetSummary>[0]);
assert.equal(summary.total, 1200);
assert.equal(summary.spent, 650);
assert.equal(summary.remaining, 550);
assert.equal(summary.percent, 54);

const defaultChecklist = getDefaultChecklistItems();
assert.ok(defaultChecklist.length > 0);

console.log("trip planning checks passed");
