/**
 * Full E2E API Verification Script
 * Tests all customer and admin flows against the running backend.
 * Run: node e2e_test.js
 */

const http = require('http');

const BASE = 'http://localhost:5000/api/v1';

// ─── Helpers ────────────────────────────────────────────────────────────────
function request(method, path, body, token) {
  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : null;
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: `/api/v1${path}`,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(payload ? { 'Content-Length': Buffer.byteLength(payload) } : {}),
      },
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });

    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

function pass(label) {
  console.log(`  ✅  PASS  ${label}`);
}

function fail(label, detail) {
  console.error(`  ❌  FAIL  ${label}`);
  if (detail) console.error(`         ↳ ${JSON.stringify(detail)}`);
}

function section(title) {
  console.log(`\n${'═'.repeat(60)}`);
  console.log(`  ${title}`);
  console.log('═'.repeat(60));
}

// ─── Tests ──────────────────────────────────────────────────────────────────
async function run() {
  console.log('\n🔍  Restaurant Reservation System – E2E API Verification\n');

  // ── 1. Health Check ──────────────────────────────────────────────────────
  section('1. HEALTH CHECK');
  const health = await request('GET', '');
  health.status === 200 && health.body.success
    ? pass('API is up and responding')
    : fail('API health check', health.body);

  // ── 2. Customer Registration ─────────────────────────────────────────────
  section('2. CUSTOMER REGISTRATION');
  const email = `qatest_${Date.now()}@example.com`;
  const regRes = await request('POST', '/auth/register', {
    name: 'QA Test Customer',
    email,
    password: 'password123',
  });

  let customerToken = null;
  if (regRes.status === 201 && regRes.body.success) {
    customerToken = regRes.body.data?.token;
    pass(`Registered customer: ${email}`);
  } else {
    fail('Customer registration', regRes.body);
    return;
  }

  // ── 3. Customer Login ────────────────────────────────────────────────────
  section('3. CUSTOMER LOGIN');
  const loginRes = await request('POST', '/auth/login', {
    email,
    password: 'password123',
  });

  if (loginRes.status === 200 && loginRes.body.success) {
    customerToken = loginRes.body.data?.token;
    pass(`Logged in as customer (token received: ${!!customerToken})`);
  } else {
    fail('Customer login', loginRes.body);
    return;
  }

  // ── 4. Profile (Session Restore simulation) ──────────────────────────────
  section('4. PROFILE / SESSION RESTORE');
  const profileRes = await request('GET', '/auth/profile', null, customerToken);
  if (profileRes.status === 200 && profileRes.body.success) {
    const u = profileRes.body.data?.user;
    pass(`Profile fetched: ${u.name} (${u.email}) | role: ${u.role}`);
  } else {
    fail('Profile fetch', profileRes.body);
  }

  // ── 5. Create First Reservation ──────────────────────────────────────────
  section('5. CREATE RESERVATION #1 (guest=2, 18:00-20:00)');
  const resv1 = await request('POST', '/reservations', {
    reservationDate: '2026-12-20',
    timeSlot: '18:00-20:00',
    guestCount: 2,
  }, customerToken);

  let resv1Id = null;
  let table1 = null;
  if (resv1.status === 201 && resv1.body.success) {
    resv1Id = resv1.body.data?.reservation?._id;
    table1 = resv1.body.data?.reservation?.table;
    pass(`Reservation #1 created → ID: ${resv1Id} | Table: ${JSON.stringify(table1)}`);
  } else {
    fail('Create reservation #1', resv1.body);
  }

  // ── 6. Create Second Reservation (same slot → different table) ───────────
  section('6. CREATE RESERVATION #2 (same slot, guest=2) – table re-allocation test');
  const resv2 = await request('POST', '/reservations', {
    reservationDate: '2026-12-20',
    timeSlot: '18:00-20:00',
    guestCount: 2,
  }, customerToken);

  let resv2Id = null;
  if (resv2.status === 201 && resv2.body.success) {
    resv2Id = resv2.body.data?.reservation?._id;
    const table2 = resv2.body.data?.reservation?.table;
    const differentTable = JSON.stringify(table1) !== JSON.stringify(table2);
    if (differentTable) {
      pass(`Reservation #2 created → allocated a DIFFERENT table: ${JSON.stringify(table2)}`);
    } else {
      fail('Table re-allocation: same table assigned', { table1, table2 });
    }
  } else if (resv2.status === 409) {
    pass(`Conflict correctly detected: ${resv2.body.message}`);
  } else {
    fail('Create reservation #2', resv2.body);
  }

  // ── 7. Get My Reservations ───────────────────────────────────────────────
  section('7. GET MY RESERVATIONS');
  const myRes = await request('GET', '/reservations/my', null, customerToken);
  if (myRes.status === 200 && myRes.body.success) {
    const list = myRes.body.data?.reservations;
    pass(`Fetched ${list.length} reservation(s) for the customer`);
    list.forEach((r, i) => {
      console.log(`     [${i + 1}] ID: ${r._id} | Date: ${r.reservationDate?.split('T')[0]} | Slot: ${r.timeSlot} | Status: ${r.status}`);
    });
  } else {
    fail('Get my reservations', myRes.body);
  }

  // ── 8. Cancel Customer Reservation ──────────────────────────────────────
  section('8. CANCEL RESERVATION #1 (customer cancel)');
  if (resv1Id) {
    const cancelRes = await request('DELETE', `/reservations/${resv1Id}`, null, customerToken);
    if (cancelRes.status === 200 && cancelRes.body.success) {
      pass(`Reservation ${resv1Id} cancelled successfully`);
    } else {
      fail('Cancel reservation #1', cancelRes.body);
    }
  } else {
    fail('No reservation ID available to cancel');
  }

  // ── 9. Verify Table is Free Again (re-book same slot) ───────────────────
  section('9. VERIFY TABLE FREED (re-book same slot after cancel)');
  const resv3 = await request('POST', '/reservations', {
    reservationDate: '2026-12-20',
    timeSlot: '18:00-20:00',
    guestCount: 2,
  }, customerToken);

  let resv3Id = null;
  if (resv3.status === 201 && resv3.body.success) {
    resv3Id = resv3.body.data?.reservation?._id;
    pass(`Re-booking succeeded after cancellation → Table: ${JSON.stringify(resv3.body.data?.reservation?.table)}`);
  } else {
    fail('Re-booking after cancel failed', resv3.body);
  }

  // ── 10. Admin Login ──────────────────────────────────────────────────────
  section('10. ADMIN LOGIN');
  const adminLogin = await request('POST', '/auth/login', {
    email: 'admin@example.com',
    password: 'password123',
  });

  let adminToken = null;
  if (adminLogin.status === 200 && adminLogin.body.success) {
    adminToken = adminLogin.body.data?.token;
    pass(`Admin logged in (token received: ${!!adminToken})`);
  } else {
    fail('Admin login', adminLogin.body);
    return;
  }

  // ── 11. Admin: Get All Reservations ─────────────────────────────────────
  section('11. ADMIN GET ALL RESERVATIONS');
  const allRes = await request('GET', '/admin/reservations', null, adminToken);
  if (allRes.status === 200 && allRes.body.success) {
    const list = allRes.body.data?.reservations;
    pass(`Admin fetched ${list.length} total reservation(s)`);
  } else {
    fail('Admin get all reservations', allRes.body);
  }

  // ── 12. Admin: Filter by Date ────────────────────────────────────────────
  section('12. ADMIN DATE FILTER');
  const filteredRes = await request('GET', '/admin/reservations?date=2026-12-20', null, adminToken);
  if (filteredRes.status === 200 && filteredRes.body.success) {
    const list = filteredRes.body.data?.reservations;
    const allMatch = list.every((r) => r.reservationDate?.startsWith('2026-12-20'));
    pass(`Date filter returned ${list.length} reservation(s) for 2026-12-20`);
    if (list.length > 0 && !allMatch) {
      fail('Date filter: some reservations have wrong dates', list.map(r => r.reservationDate));
    }
  } else {
    fail('Admin date filter', filteredRes.body);
  }

  // ── 13. Admin: Update Reservation ────────────────────────────────────────
  section('13. ADMIN UPDATE RESERVATION');
  const targetId = resv3Id || resv2Id;
  if (targetId) {
    const updateRes = await request('PATCH', `/admin/reservations/${targetId}`, {
      guestCount: 4,
      timeSlot: '20:00-22:00',
    }, adminToken);

    if (updateRes.status === 200 && updateRes.body.success) {
      const updated = updateRes.body.data?.reservation;
      pass(`Reservation ${targetId} updated → guestCount: ${updated?.guestCount}, slot: ${updated?.timeSlot}`);
    } else {
      fail('Admin update reservation', updateRes.body);
    }
  } else {
    fail('No reservation ID available to update');
  }

  // ── 14. Admin: Cancel Reservation ───────────────────────────────────────
  section('14. ADMIN CANCEL RESERVATION');
  if (resv2Id) {
    const adminCancel = await request('DELETE', `/admin/reservations/${resv2Id}`, null, adminToken);
    if (adminCancel.status === 200 && adminCancel.body.success) {
      pass(`Admin cancelled reservation ${resv2Id} successfully`);
    } else {
      fail('Admin cancel reservation', adminCancel.body);
    }
  } else {
    fail('No reservation ID available for admin cancel');
  }

  // ── 15. Authorization Guard Tests ────────────────────────────────────────
  section('15. AUTHORIZATION GUARDS');
  const guardRes = await request('GET', '/admin/reservations', null, customerToken);
  if (guardRes.status === 403) {
    pass(`RBAC guard: customer correctly blocked from admin routes (403 Forbidden)`);
  } else {
    fail('RBAC guard: customer should not access /admin/reservations', guardRes.body);
  }

  const noTokenRes = await request('GET', '/reservations/my', null, null);
  if (noTokenRes.status === 401) {
    pass(`Auth guard: unauthenticated request correctly rejected (401 Unauthorized)`);
  } else {
    fail('Auth guard: unauthenticated request should return 401', noTokenRes.body);
  }

  // ── 16. Validation Guard Tests ───────────────────────────────────────────
  section('16. VALIDATION GUARDS');
  const badDate = await request('POST', '/reservations', {
    reservationDate: '2020-01-01',
    timeSlot: '18:00-20:00',
    guestCount: 2,
  }, customerToken);
  if (badDate.status === 400) {
    pass(`Past date validation: rejected with 400`);
  } else {
    fail('Past date validation: should return 400', badDate.body);
  }

  const badGuests = await request('POST', '/reservations', {
    reservationDate: '2026-12-25',
    timeSlot: '18:00-20:00',
    guestCount: 99,
  }, customerToken);
  if (badGuests.status === 400) {
    pass(`Guest count > 8 validation: rejected with 400`);
  } else {
    fail('Guest count > 8 validation: should return 400', badGuests.body);
  }

  console.log('\n' + '═'.repeat(60));
  console.log('  ✅  ALL E2E VERIFICATION STEPS COMPLETED');
  console.log('═'.repeat(60) + '\n');
}

run().catch((err) => {
  console.error('Fatal error during E2E test:', err.message);
  process.exit(1);
});
