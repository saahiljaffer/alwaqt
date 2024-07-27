'use client'
import 'dayjs/locale/ar'

import { useEffect, useState } from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid'
import clsx from 'clsx'
import dayjs from 'dayjs'
import advancedFormat from 'dayjs/plugin/advancedFormat'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import preParsePostFormat from 'dayjs/plugin/preParsePostFormat'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import hijri from '@/lib/hijri'

dayjs.extend(customParseFormat)
dayjs.extend(localizedFormat)
dayjs.extend(preParsePostFormat)
dayjs.extend(isSameOrBefore)
dayjs.extend(isSameOrAfter)
dayjs.extend(advancedFormat)
dayjs.extend(hijri)

const holidays = [
  {
    title: 'Ashura',
    date: '1/10',
    color: '11',
    busyStatus: 'BUSY',
  },
  {
    title: '10th of Imam Husayn (a)',
    date: '1/20',
    color: '11',
  },
  {
    title: 'Shahadat of Imam Zayn al-Abidin (a)',
    date: '1/25',
    color: '11',
  },
  {
    title: '20th of Imam Husayn (a)',
    date: '1/30',
    fallbackDate: '2/1',
    color: '11',
  },
  {
    title: 'Shahadat of Imam Hasan (a)',
    date: '2/7',
    color: '11',
  },
  {
    title: '30th of Imam Husayn (a)',
    date: '2/10',
    color: '11',
  },
  {
    title: '40th of Imam Husayn (a) (Chehlum/Arbain)',
    date: '2/20',
    color: '11',
    busyStatus: 'BUSY',
  },
  {
    title: 'Wafat of Prophet Muhammad (s)',
    date: '2/28',
    color: '11',
  },
  {
    title: 'Shahadat of Imam Ali ar-Ridha (a)',
    date: '2/29',
    color: '11',
  },
  {
    title: 'Wafat of Bibi Masuma Qum (a)',
    date: '3/4',
    color: '11',
  },
  {
    title: 'Shahadat of Imam Hasan al-Askari (a)',
    date: '3/8',
    color: '11',
  },
  {
    title: 'Eid az-Zahra (a)',
    date: '3/9',
    color: '10',
  },
  {
    title: 'First Day of Imamat of Imam Mahdi (atfs)',
    date: '3/9',
    color: '10',
  },
  {
    title: 'Wiladat of Prophet Muhammad (s)',
    date: '3/17',
    color: '10',
  },
  {
    title: 'Wiladat of Imam Jafar as-Sadiq (a)',
    date: '3/17',
    color: '10',
  },
  {
    title: 'Wiladat of Imam Hasan al-Askari',
    date: '4/10',
    color: '10',
  },
  {
    title: 'Wiladat of Bibi Zaynab (a)',
    date: '5/5',
    color: '10',
  },
  {
    title: 'First Fatimiyya - Shahadat of Bibi Fatima (a)',
    date: '5/13',
    color: '11',
  },
  {
    title: 'Shahadat of Bibi Fatima (a)',
    date: '6/3',
    color: '11',
  },
  {
    title: 'Wiladat of Bibi Fatima (a)',
    date: '6/20',
    color: '10',
  },
  {
    title: 'Wiladat of Imam Muhammad al-Baqir (a)',
    date: '7/1',
    color: '10',
  },
  {
    title: 'Shahadat of Imam Ali an-Naqi (a)',
    date: '7/3',
    color: '11',
  },
  {
    title: 'Wiladat of Imam Muhammad at-Taqi (a)',
    date: '7/10',
    color: '10',
  },
  {
    title: 'Wiladat of Imam Ali (a)',
    date: '7/13',
    color: '10',
  },
  {
    title: 'Wafat of Bibi Zaynab (a)',
    date: '7/15',
    color: '11',
  },
  {
    title: 'Shahadat of Imam Musa al-Kadhim (a)',
    date: '7/25',
    color: '11',
  },
  {
    title: 'Wafat of Hazarat Abu Talib (a)',
    date: '7/26',
    color: '11',
  },
  {
    title: 'Miraj & Mabath of Holy Prophet (s)',
    date: '7/27',
    color: '10',
  },
  {
    title: 'Wiladat of Imam Husayn (a)',
    date: '8/3',
    color: '10',
  },
  {
    title: 'Wiladat of Hazarat Abbas (a)',
    date: '8/4',
    color: '10',
  },
  {
    title: 'Wiladat of Imam Ali Zayn al-Abidin (a)',
    date: '8/5',
    color: '10',
  },
  {
    title: 'Wiladat of Imam Mahdi (atfs)',
    date: '8/15',
    color: '10',
  },
  {
    title: 'Wafat of Bibi Khadija (a)',
    date: '9/10',
    color: '11',
  },
  {
    title: 'Wiladat of Imam Hasan (a)',
    date: '9/15',
    color: '10',
  },
  {
    title: 'Yawm-E-Zarbat of Imam Ali (a)',
    date: '9/19',
    color: '11',
  },
  {
    title: 'Shahadat of Imam Ali (a)',
    date: '9/21',
    color: '11',
  },
  {
    title: 'Laylatul Qadr',
    date: '9/23',
    color: '10',
  },
  {
    title: 'Eid al-Fitr',
    date: '10/1',
    color: '10',
    busyStatus: 'BUSY',
  },
  {
    title: 'Shahadat of Imam Jafar as-Sadiq (a)',
    date: '10/25',
    color: '11',
  },
  {
    title: 'Wiladat of Imam Ali ar-Ridha (a)',
    date: '11/11',
    color: '10',
  },
  {
    title: 'Shahadat of Imam Muhammad at-Taqi (a)',
    fallbackDate: '11/29',
    color: '11',
  },
  {
    title: 'Shahadat of Imam Muhammad al-Baqir (a)',
    date: '12/7',
    color: '11',
  },
  {
    title: 'Shahadat of H. Muslim ibn Aqil (a)',
    date: '12/9',
    color: '11',
  },
  {
    title: 'Eid al-Adha',
    date: '12/10',
    color: '10',
    busyStatus: 'BUSY',
  },
  {
    title: 'Wiladat of Imam Ali an-Naqi (a)',
    date: '12/15',
    color: '10',
  },
  {
    title: 'Eid al-Ghadir',
    date: '12/18',
    color: '10',
  },
  {
    title: 'Shahadat of sons of H. Muslim ibn Aqil (a)',
    date: '12/22',
    color: '11',
  },
  {
    title: 'Eid al-Mubahala',
    date: '12/24',
    color: '10',
  },
]

const generateCalendarArray = (startDate: any, endDate: any, month: number) => {
  const today = dayjs()
  let days = []

  for (
    let date = startDate;
    date.isSameOrBefore(endDate);
    date = date.add(1, 'day')
  ) {
    let dateObject = date.locale('ar').format('iYYYY-iMM-iD')
    let englishDate = date.format('YYYY-MM-D')

    let isCurrentMonth = false,
      isToday = false,
      color: string | undefined

    if (date.iMonth() === month - 1) {
      isCurrentMonth = true
    }

    if (date.isSame(today, 'day')) {
      isToday = true
    }

    color = holidays.find((holiday) => holiday.date === date.format('iM/iD'))
      ?.color

    days.push({
      hijriDate: dateObject,
      englishDate,
      isCurrentMonth,
      isToday,
      color,
      events: holidays.filter(
        (holiday) => holiday.date === date.format('iM/iD'),
      ),
    })
  }

  return days
}

function PrayerTimes() {
  const [times, setTimes] = useState({
    imsak: '0:00',
    fajr: '0:00',
    sunrise: '0:00',
    dhuhr: '0:00',
    sunset: '0:00',
    maghrib: '0:00',
  })
  useEffect(() => {
    dayjs.extend(customParseFormat)

    fetch('/api/timings')
      .then((res) => res.json())
      .then((data) => setTimes(data))
  }, [])

  return (
    <div className="hidden md:block">
      <ul className="flex gap-8">
        <li className="text-center">
          <p className="font-medium">إمساك</p>
          <p>{times.imsak}</p>
        </li>
        <li className="text-center">
          <p className="font-medium">الفجر</p>
          <p>{times.fajr}</p>
        </li>
        <li className="text-center">
          <p className="font-medium">الشروق</p>
          <p>{times.sunrise}</p>
        </li>
        <li className="text-center">
          <p className="font-medium">الظهر</p>
          <p>{times.dhuhr}</p>
        </li>
        <li className="text-center">
          <p className="font-medium">غروب</p>
          <p>{times.sunset}</p>
        </li>
        <li className="text-center">
          <p className="font-medium">المغرب</p>
          <p>{times.maghrib}</p>
        </li>
      </ul>
    </div>
  )
}

function MonthView({
  startDate,
  endDate,
  month,
}: {
  startDate: any
  endDate: any
  month: number
}) {
  const [days, setDays] = useState<any[]>([])
  useEffect(() => {
    setDays(generateCalendarArray(startDate, endDate, month))
  }, [startDate, endDate, setDays, month])

  return (
    <div className="mx-2 flex flex-auto flex-col shadow ring-1 ring-black ring-opacity-5">
      <div className="grid grid-cols-7 gap-px border-b border-slate-300 bg-slate-200 text-center text-xs font-semibold leading-6 text-slate-700 lg:flex-none">
        <div className="bg-white py-2">
          S<span className="sr-only sm:not-sr-only">un</span>
        </div>
        <div className="bg-white py-2">
          M<span className="sr-only sm:not-sr-only">on</span>
        </div>
        <div className="bg-white py-2">
          T<span className="sr-only sm:not-sr-only">ue</span>
        </div>
        <div className="bg-white py-2">
          W<span className="sr-only sm:not-sr-only">ed</span>
        </div>
        <div className="bg-white py-2">
          T<span className="sr-only sm:not-sr-only">hu</span>
        </div>
        <div className="bg-white py-2">
          F<span className="sr-only sm:not-sr-only">ri</span>
        </div>
        <div className="bg-white py-2">
          S<span className="sr-only sm:not-sr-only">at</span>
        </div>
      </div>
      <div className="flex flex-auto bg-slate-200 text-xs leading-6 text-slate-700">
        <div
          className={clsx(
            days.length === 42 ? 'grid-rows-6' : 'grid-rows-5',
            'grid w-full grid-cols-7 gap-px',
          )}
        >
          {days.map((day: any) => (
            <div
              key={day.englishDate}
              className={clsx(
                day.isCurrentMonth && day.color !== '10' && day.color !== '11'
                  ? 'bg-white'
                  : 'bg-slate-50 text-slate-500',
                day.color === '10' && 'bg-teal-600 font-semibold text-white',
                'relative px-3 py-2',
                day.color === '11' && 'bg-slate-600 font-semibold text-white',
                'relative px-3 py-2',
              )}
            >
              <time
                dateTime={day.date}
                className={clsx(
                  day.isToday &&
                    '-mx-3 -mt-2 bg-indigo-600 px-3 py-2 font-semibold text-white',
                  'block text-end sm:flex sm:justify-between',
                )}
              >
                <p>{day.hijriDate.split('-').pop()}</p>
                <p>{day.englishDate.split('-').pop()}</p>
              </time>
              {day.events.length > 0 && (
                <ol className="mt-2 hidden sm:block">
                  {day.events.slice(0, 2).map((event: any) => (
                    <li key={event.title}>
                      <a href={event.href} className="group flex">
                        <p className="flex-auto font-medium leading-4">
                          {event.title}
                        </p>
                        <time
                          dateTime={event.datetime}
                          className="ml-3 hidden flex-none xl:block"
                        >
                          {event.time}
                        </time>
                      </a>
                    </li>
                  ))}
                  {day.events.length > 2 && (
                    <li className="text-slate-500">
                      + {day.events.length - 2} more
                    </li>
                  )}
                </ol>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function Page() {
  const [year, setYear] = useState(dayjs().iYear())
  const [month, setMonth] = useState(dayjs().iMonth() + 1)

  const startDate = dayjs(`${year}-${month}-01`, 'iYYYY-iM-iDD').startOf('week')
  const endDate = dayjs(`${year}-${month + 1}-01`, 'iYYYY-iM-iDD')
    .subtract(1, 'day')
    .endOf('week')

  const hijriHeader = dayjs(`${year}-${month}-01`, 'iYYYY-iM-iDD')
    .locale('ar')
    .format('iMMMM iYYYY')
  const startOfMonth = dayjs(`${year}-${month}-01`, 'iYYYY-iM-iDD')
  const endOfMonth = dayjs(`${year}-${month + 1}-01`, 'iYYYY-iM-iDD').subtract(
    1,
    'day',
  )

  let englishHeader: string

  if (startOfMonth.isSame(endOfMonth, 'month')) {
    englishHeader = startOfMonth.format('MMMM YYYY')
  } else {
    englishHeader = `${startOfMonth.format('MMMM YYYY')} - ${endOfMonth.format(
      'MMMM YYYY',
    )}`
  }
  return (
    <div className="col-span-3 flex h-full min-h-screen w-full flex-col tabular-nums">
      <header className="grid grid-cols-2 items-center justify-between border-b border-slate-200 px-6 py-4 md:grid-cols-3 lg:flex-none">
        <h1 className="text-base font-semibold normal-nums leading-6 text-slate-900">
          <p>{hijriHeader}</p>
          <p>{englishHeader}</p>
        </h1>
        <PrayerTimes />
        <div className="flex items-center justify-end">
          <div className="relative flex items-center rounded-md bg-white shadow-sm md:items-stretch">
            <button
              type="button"
              className="flex h-9 w-12 items-center justify-center rounded-l-md border-y border-l border-slate-300 pr-1 text-slate-400 hover:text-slate-500 focus:relative md:w-9 md:pr-0 md:hover:bg-slate-50"
              disabled={year === 1440 && month === 1}
              onClick={() => {
                if (month === 1) {
                  setYear(year - 1)
                  setMonth(12)
                } else {
                  setMonth(month - 1)
                }
              }}
            >
              <span className="sr-only">Previous month</span>
              <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              className="hidden border-y border-slate-300 px-3.5 text-sm font-semibold text-slate-900 hover:bg-slate-50 focus:relative md:block"
              onClick={() => {
                setYear(dayjs().iYear())
                setMonth(dayjs().iMonth() + 1)
              }}
            >
              Today
            </button>
            <span className="relative -mx-px h-5 w-px bg-slate-300 md:hidden" />
            <button
              type="button"
              className="flex h-9 w-12 items-center justify-center rounded-r-md border-y border-r border-slate-300 pl-1 text-slate-400 hover:text-slate-500 focus:relative md:w-9 md:pl-0 md:hover:bg-slate-50"
              disabled={year === 1447 && month === 12}
              onClick={() => {
                if (month === 12) {
                  setYear(year + 1)
                  setMonth(1)
                } else {
                  setMonth(month + 1)
                }
              }}
            >
              <span className="sr-only">Next month</span>
              <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>
      <MonthView startDate={startDate} endDate={endDate} month={month} />
    </div>
  )
}
