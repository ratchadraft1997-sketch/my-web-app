import assert from "node:assert/strict";
import { buildTripShareText, getTripBudgetSummary, getDefaultChecklistItems } from "./trip-planning";

const trip: Parameters<typeof buildTripShareText>[0] = {
  title: "ทริปสายน้ำตก",
  duration: "1 วัน",
  estimatedBudget: "500 บาท",
  items: [
    { placeName: "น้ำตกสาริกา" },
    { placeName: "เขาช่องลม" },
  ],
  budget: { total: 1200, spent: 650, note: "ยังเหลือ" },
};

const shareText = buildTripShareText(trip);
assert.match(shareText, /ทริปสายน้ำตก/);
assert.match(shareText, /น้ำตกสาริกา/);
assert.match(shareText, /เหลือ 550 บาท/);

const summary = getTripBudgetSummary(trip);
assert.equal(summary.total, 1200);
assert.equal(summary.spent, 650);
assert.equal(summary.remaining, 550);
assert.equal(summary.percent, 54);

const defaultChecklist = getDefaultChecklistItems();
assert.ok(defaultChecklist.length > 0);

console.log("trip planning checks passed");
