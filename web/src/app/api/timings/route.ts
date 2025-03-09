import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import { redirect } from 'next/navigation'
import utc from 'dayjs/plugin/utc'

export async function GET(request: Request) {
  dayjs.extend(utc)
  dayjs.extend(timezone)

  const today = dayjs().tz('America/Toronto')
  redirect(`/api/timings/${today.format('YYYY-MM-DD')}`)
}

export const dynamic = 'force-dynamic'
