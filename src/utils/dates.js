import { getISOWeek, getISOWeekYear, format } from 'date-fns'

export function todayKey(date = new Date()) {
  return format(date, 'yyyy-MM-dd')
}

export function weekKey(date = new Date()) {
  return `${getISOWeekYear(date)}-W${getISOWeek(date)}`
}

// Determines which zone (0-indexed) is "active" this week, cycling
// through all zones based on the ISO week number.
export function currentZoneIndex(numZones, date = new Date()) {
  const w = getISOWeek(date)
  return (w - 1) % numZones
}

export function lastNDays(n) {
  const days = []
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    days.push(d)
  }
  return days
}

export function formatDayLabel(dateKeyStr) {
  const [, m, d] = dateKeyStr.split('-')
  return `${d}/${m}`
}
