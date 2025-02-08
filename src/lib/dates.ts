import { Temporal } from 'temporal-polyfill';

const MONTHS_MAPPING = [
  'いちがつ',  // January
  'にがつ',    // February
  'さんがつ',  // March
  'しがつ',    // April
  'ごがつ',    // May
  'ろくがつ',  // June
  'しちがつ',  // July
  'はちがつ',  // August
  'くがつ',    // September
  'じゅうがつ', // October
  'じゅういちがつ', // November
  'じゅうにがつ'  // December
] as const;

// 日期mapping, key为日期，value是對應的日文
const DATES_MAPPING = [
  'ついたち',  // 1
  'ふつか',    // 2
  'みっか',    // 3
  'よっか',    // 4
  'いつか',    // 5
  'むいか',    // 6
  'なのか',    // 7
  'ようか',    // 8
  'ここのか',  // 9
  'とおか',    // 10
  'じゅういちにち', // 11
  'じゅうににち',  // 12
  'じゅうさんにち', // 13
  'じゅうよっか',   // 14
  'じゅうごにち',   // 15
  'じゅうろくにち', // 16
  'じゅうしちにち', // 17
  'じゅうはちにち', // 18
  'じゅうくにち',   // 19
  'はつか',        // 20
  'にじゅういちにち', // 21
  'にじゅうににち',  // 22
  'にじゅうさんにち', // 23
  'にじゅうよんにち', // 24
  'にじゅうごにち',   // 25
  'にじゅうろくにち', // 26
  'にじゅうしちにち', // 27
  'にじゅうはちにち', // 28
  'にじゅうくにち',   // 29
  'さんじゅうにち',   // 30
  'さんじゅういちにち', // 31
]

export function getMonthHirakana(month: number) {
  return MONTHS_MAPPING[month - 1];
}

export function getMonth() {
  return Temporal.Now.zonedDateTimeISO().month;
}

export function getDateHirakana(date: number) {
  return DATES_MAPPING[date - 1];
}

export function getDate() {
  return Temporal.Now.zonedDateTimeISO().day;
}

export function getYYYYMMDD() {
  const now = Temporal.Now.zonedDateTimeISO();
  return `${now.month}月${now.day}日`;
}

export function getYYYYMMDDHirakana() {
  const now = Temporal.Now.zonedDateTimeISO();
  return `${getMonthHirakana(now.month)} - ${getDateHirakana(now.day)}`;
}