import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import db from '@/lib/db'

dayjs.extend(utc)
dayjs.extend(timezone)

function formatTime(time: string, isDst: number): string {
  return dayjs(`${dayjs().format('YYYY-MM-DD')} ${time}`)
    .add(isDst, 'hours')
    .format('h:mm')
}

export async function GET(
  request: Request,
  { params }: { params: { date: string } },
) {
  const date = params.date
  const d = dayjs.utc(date).hour(12)
  const month = String(d.month() + 1) // 1-12, match TEXT column
  const day = String(d.date()) // 1-31, match TEXT column
  const isDst = d.tz('America/Toronto').utcOffset() === -240 ? 1 : 0

  const row = db
    .prepare(
      `SELECT imsak, fajr, sunrise, dhuhr, sunset, maghrib, midnight
       FROM times
       WHERE month = ? AND day = ?`,
    )
    .get(month, day) as
    | {
        imsak: string
        fajr: string
        sunrise: string
        dhuhr: string
        sunset: string
        maghrib: string
        midnight: string
      }
    | undefined

  if (!row) {
    return Response.json(
      { error: 'No times found for this date' },
      { status: 404 },
    )
  }

  const prayers: { [key: string]: string } = {
    imsak: formatTime(row.imsak, isDst),
    fajr: formatTime(row.fajr, isDst),
    sunrise: formatTime(row.sunrise, isDst),
    dhuhr: formatTime(row.dhuhr, isDst),
    sunset: formatTime(row.sunset, isDst),
    maghrib: formatTime(row.maghrib, isDst),
    midnight: formatTime(row.midnight, isDst),
  }

  return Response.json(prayers)
}
