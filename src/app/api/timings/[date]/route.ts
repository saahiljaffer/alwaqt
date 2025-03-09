import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import { initializeApp } from 'firebase/app'
import { doc, getDoc, getFirestore } from 'firebase/firestore/lite'

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: 'prayers-be161.firebaseapp.com',
  projectId: 'prayers-be161',
  storageBucket: 'prayers-be161.appspot.com',
  messagingSenderId: '946674115385',
  appId: '1:946674115385:web:942da346b4b549d44ebee8',
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

export async function GET(
  request: Request,
  { params }: { params: { date: string } },
) {
  const date = params.date
  dayjs.extend(utc)
  dayjs.extend(timezone)

  const day = dayjs.utc(date).hour(12)
  const docRef = doc(db, 'times', day.format('MM-DD'))
  const docSnap = await getDoc(docRef)
  const prayers: { [key: string]: string } = docSnap.data() || {}
  const isDst = day.tz('America/Toronto').utcOffset() === -240 ? 1 : 0

  Object.keys(prayers).forEach((name) => {
    prayers[name] = dayjs(`${dayjs().format('YYYY-MM-DD')} ${prayers[name]}`)
      .add(isDst, 'hours')
      .format('h:mm')
  })

  return Response.json(prayers)
}
