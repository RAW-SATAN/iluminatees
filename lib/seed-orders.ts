import { ORDERS_KEY } from './admin-auth';

const PRODUCTS = [
  { name: 'APEX OVERSIZED TEE', price: 1299 },
  { name: 'CIPHER HOODIE', price: 2499 },
  { name: 'SACRED BOMBER JACKET', price: 3999 },
  { name: 'VOID CARGO PANTS', price: 2999 },
  { name: 'ILUM CORE TEE', price: 899 },
  { name: 'OMEN SHORTS', price: 1499 },
  { name: 'RITUAL SWEATSHIRT', price: 1999 },
  { name: 'SPECTER LONG SLEEVE', price: 1699 },
  { name: 'PHANTOM JACKET', price: 4499 },
  { name: 'NOCTURNE CAP', price: 799 },
];

const CITIES = [
  { city: 'Mumbai', state: 'Maharashtra', pin: '400001' },
  { city: 'New Delhi', state: 'Delhi', pin: '110001' },
  { city: 'Bengaluru', state: 'Karnataka', pin: '560001' },
  { city: 'Hyderabad', state: 'Telangana', pin: '500001' },
  { city: 'Chennai', state: 'Tamil Nadu', pin: '600001' },
  { city: 'Pune', state: 'Maharashtra', pin: '411001' },
  { city: 'Kolkata', state: 'West Bengal', pin: '700001' },
  { city: 'Jaipur', state: 'Rajasthan', pin: '302001' },
  { city: 'Ahmedabad', state: 'Gujarat', pin: '380001' },
  { city: 'Surat', state: 'Gujarat', pin: '395001' },
  { city: 'Lucknow', state: 'Uttar Pradesh', pin: '226001' },
  { city: 'Chandigarh', state: 'Punjab', pin: '160001' },
  { city: 'Nagpur', state: 'Maharashtra', pin: '440001' },
  { city: 'Indore', state: 'Madhya Pradesh', pin: '452001' },
  { city: 'Goa', state: 'Goa', pin: '403001' },
  { city: 'Bhopal', state: 'Madhya Pradesh', pin: '462001' },
  { city: 'Kochi', state: 'Kerala', pin: '682001' },
  { city: 'Noida', state: 'Uttar Pradesh', pin: '201301' },
  { city: 'Gurugram', state: 'Haryana', pin: '122001' },
  { city: 'Vadodara', state: 'Gujarat', pin: '390001' },
];

const FIRST = ['Arjun','Rohan','Priya','Ankit','Rahul','Sneha','Karan','Divya','Vikram','Aisha','Dev','Pooja','Harsh','Tanya','Siddharth','Nidhi','Aarav','Meera','Kabir','Riya','Yash','Kiara','Aditya','Sana','Nikhil','Ishaan','Aditi','Pranav','Shreya','Varun','Zara','Akash','Naina','Shubham','Kritika','Ayush','Simran','Mohit','Lavanya','Rishabh'];
const LAST = ['Sharma','Patel','Singh','Verma','Gupta','Kumar','Mehta','Joshi','Agarwal','Nair','Reddy','Bose','Shah','Malhotra','Yadav','Chopra','Iyer','Pillai','Desai','Khanna','Kapoor','Saxena','Mishra','Pandey','Srivastava'];
const SIZES = ['S','S','M','M','M','L','L','XL','XXL'];
const PAYS = ['upi','upi','upi','upi','card','card','cod'];
const STATUSES_BY_AGE = {
  old: ['delivered','delivered','delivered','delivered','delivered','cancelled'],
  mid: ['delivered','delivered','delivered','shipped','cancelled'],
  recent: ['delivered','shipped','shipped','confirmed','confirmed'],
};

// [year, month(0-indexed), count]  — May 2023 → Jun 2026, total ~1100 orders
const MONTHLY: [number, number, number][] = [
  [2023,4,3],[2023,5,4],[2023,6,4],[2023,7,5],[2023,8,6],[2023,9,7],[2023,10,10],[2023,11,12],
  [2024,0,9],[2024,1,10],[2024,2,12],[2024,3,13],[2024,4,14],[2024,5,15],[2024,6,16],[2024,7,17],[2024,8,19],[2024,9,24],[2024,10,30],[2024,11,33],
  [2025,0,26],[2025,1,28],[2025,2,31],[2025,3,33],[2025,4,37],[2025,5,40],[2025,6,44],[2025,7,48],[2025,8,52],[2025,9,63],[2025,10,80],[2025,11,85],
  [2026,0,68],[2026,1,72],[2026,2,77],[2026,3,82],[2026,4,88],[2026,5,4],
];

// Park-Miller LCG — deterministic, good spread
let _s = 12345;
function rng() { _s = (_s * 16807) % 2147483647; return _s / 2147483647; }
function ri(max: number) { return Math.floor(rng() * max); }
function pick<T>(arr: T[]): T { return arr[ri(arr.length)]; }

export function seedDemoOrders(): void {
  if (typeof window === 'undefined') return;
  try {
    const existing = JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]');
    if (existing.length > 0) return;
  } catch {}

  _s = 12345; // reset for determinism

  const orders: object[] = [];
  let num = 1001;
  const now = new Date();

  for (const [year, month, count] of MONTHLY) {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const monthDate = new Date(year, month, 1);
    const monthsAgo = (now.getFullYear() - year) * 12 + (now.getMonth() - month);
    const statusPool = monthsAgo > 6 ? STATUSES_BY_AGE.old : monthsAgo > 2 ? STATUSES_BY_AGE.mid : STATUSES_BY_AGE.recent;

    for (let i = 0; i < count; i++) {
      const day = Math.min(1 + ri(daysInMonth), daysInMonth);
      const date = new Date(year, month, day, ri(22) + 1, ri(60)).toISOString();

      const loc = pick(CITIES);
      const fn = pick(FIRST);
      const ln = pick(LAST);
      const email = `${fn.toLowerCase()}${ri(999)}@gmail.com`;
      const prefix = pick([70,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99]);
      const phone = `+91 ${prefix}${10000000 + ri(89999999)}`;

      const itemCount = rng() > 0.75 ? 2 : 1;
      const items = Array.from({ length: itemCount }, () => {
        const p = pick(PRODUCTS);
        return { name: p.name, price: p.price, quantity: 1, size: pick(SIZES) };
      });

      const subtotal = items.reduce((s, it) => s + it.price, 0);
      const shipping = subtotal >= 999 ? 0 : 99;

      // Random discount for ~15% of orders
      const discount = rng() > 0.85 ? Math.round(subtotal * 0.1) : 0;
      const total = subtotal + shipping - discount;

      orders.push({
        id: `ILM${num++}`,
        date,
        items,
        total,
        discount,
        shipping: {
          firstName: fn, lastName: ln,
          address: `${ri(999) + 1}, ${pick(['MG Road','Linking Road','FC Road','Brigade Road','Connaught Place','Juhu','Bandra West','Koregaon Park'])}`,
          city: loc.city, state: loc.state, pin: loc.pin,
          email, phone,
        },
        status: pick(statusPool),
        payMethod: pick(PAYS),
      });
    }
  }

  orders.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
}
