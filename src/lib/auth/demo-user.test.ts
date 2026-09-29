import assert from "node:assert/strict";
import { buildDemoUser, getDemoUserFromCookieValue } from "./demo-user";

const demoUser = buildDemoUser("traveler@nakhonnayok.app", "นักเดินทางทดสอบ");

assert.equal(demoUser.email, "traveler@nakhonnayok.app");
assert.equal(demoUser.user_metadata.full_name, "นักเดินทางทดสอบ");

const raw = JSON.stringify(demoUser);
const encoded = encodeURIComponent(raw);

assert.deepEqual(getDemoUserFromCookieValue(raw), demoUser);
assert.deepEqual(getDemoUserFromCookieValue(encoded), demoUser);
assert.equal(getDemoUserFromCookieValue("not-json"), null);

console.log("demo user cookie checks passed");
