import dayjs from 'dayjs'
import hijri from '@/lib/hijri'
import 'dayjs/locale/ar'
import preParsePostFormat from 'dayjs/plugin/preParsePostFormat'

export async function GET(
  request: Request,
  { params }: { params: { date: string } },
) {
  dayjs.extend(hijri)
  dayjs.extend(preParsePostFormat)

  const date = dayjs(params.date).locale('ar')

  return Response.json({
    year: date.format('iYYYY'),
    month: date.format('iMMMM'),
    day: date.format('iD'),
  })
}
