import dayjs from 'dayjs'
import hijri from '../lib/hijri.js'
import { createEvents } from 'ics'
import { writeFileSync } from 'fs'
import 'dayjs/locale/ar.js'

const events = [
  { title: '1st Muharram', date: '1/1', color: '11' },
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
  { title: '1st Ramadhan', date: '9/1', color: '10' },
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
    title: 'Shahadat of Imam Jafar as-Sadiq',
    date: '10/25',
    color: '11',
  },
  {
    title: 'Wiladat of Imam Ali ar-Ridha',
    date: '11/11',
    color: '10',
  },
  {
    title: 'Shahadat of Imam Muhammad at-Taqi (a)',
    date: '11/29',
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

dayjs.extend(hijri)

const years = ['1446', '1447']
let myEventsList = []

for (let i = 0; i < years.length; i++) {
  myEventsList = myEventsList.concat(
    events.map((event) => {
      let startDate = dayjs(`${years[i]}/${event.date}`, 'iYYYY/iM/iD')
      if (!startDate.isValid()) {
        startDate = dayjs(`${years[i]}/${event.fallbackDate}`, 'iYYYY/iM/iD')
      }
      let endDate = startDate.clone().add(1, 'd')
      return {
        uid: `id_${event.title.replace(/\W/g, '').toLowerCase()}_${years[i]}`,
        start: [startDate.year(), startDate.month() + 1, startDate.date()],
        end: [endDate.year(), endDate.month() + 1, endDate.date()],
        title: event.title,
        transp: event.busyStatus === 'BUSY' ? 'OPAQUE' : 'TRANSPARENT',
      }
    }),
  )
}

createEvents(myEventsList, (error, value) => {
  if (error) {
    console.log(error)
    return
  }

  writeFileSync(`../../public/events.ics`, value)
})
