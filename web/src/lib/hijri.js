// integer division
const div = (a, b) => {
  return ~~(a / b)
}

// modulo
const mod = (a, b) => {
  return a - ~~(a / b) * b
}

// modified julian day numbers for moon sightings from 1440 to 1446
const moonSightings = [
  58255, 58284, 58314, 58343, 58372, 58401, 58431, 58461, 58491, 58520, 58550,
  58580, 58609, 58639, 58668, 58698, 58727, 58756, 58786, 58815, 58845, 58875,
  58904, 58934, 58964, 58993, 59023, 59052, 59082, 59111, 59140, 59170, 59199,
  59229, 59258, 59288, 59318, 59347, 59377, 59407, 59436, 59466, 59495, 59525,
  59554, 59583, 59613, 59642, 59672, 59701, 59731, 59761, 59790, 59820, 59850,
  59879, 59909, 59938, 59967, 59997, 60026, 60056, 60085, 60115, 60144, 60174,
  60204, 60234, 60264, 60293, 60322, 60351, 60381, 60410, 60439, 60469, 60498,
  60528, 60558, 60588, 60618, 60647, 60677, 60706, 60735, 60765, 60794, 60823,
  60853, 60882, 60912, 60942, 60972, 61002, 61031, 61061, 61090, 61119, 61149,
  61178, 61207,
]

// returns the index of the new moon closest to a modified julian day number
const getNewMoonIndexByModifiedJulian = (mjdn) => {
  for (let i = 0; i < moonSightings.length; i = i + 1) {
    if (moonSightings[i] > mjdn) return i
  }
}

// epoch
const START_MONTHS = 17264

//  converts a date from a julian day number to a hijri date
const julianToHijri = (jdn) => {
  const mjdn = jdn - 2400000.5,
    i = getNewMoonIndexByModifiedJulian(mjdn),
    totalMonths = i + START_MONTHS,
    cYears = Math.floor((totalMonths - 1) / 12),
    hy = cYears + 1,
    hm = totalMonths - 12 * cYears,
    hd = mjdn - moonSightings[i - 1] + 1

  return {
    hy: hy,
    hm: hm - 1,
    hd: hd,
  }
}

const leapGregorian = (year) => {
  return year % 4 == 0 && !(year % 100 == 0 && year % 400 != 0)
}
const GREGORIAN_EPOCH = 1721425.5

// calculates the julian day number for a gregorian calendar date
const gregorianToJulian = (year, month, day) => {
  return (
    GREGORIAN_EPOCH -
    1 +
    365 * (year - 1) +
    Math.floor((year - 1) / 4) +
    -Math.floor((year - 1) / 100) +
    Math.floor((year - 1) / 400) +
    Math.floor(
      (367 * month - 362) / 12 +
        (month <= 2 ? 0 : leapGregorian(year) ? -1 : -2) +
        day,
    )
  )
}

// returns the index of the new moon closest to a hijri date
function getNewMoonIndexByHijri(hy, hm) {
  const cYears = hy - 1,
    totalMonths = cYears * 12 + 1 + (hm - 1),
    i = totalMonths - START_MONTHS

  return i
}

// converts a hijri date to a julian day number
const hijriToJulian = (hy, hm, hd) => {
  const i = getNewMoonIndexByHijri(hy, hm),
    mjdn = hd + moonSightings[i - 1] - 1,
    jdn = mjdn + 2400000.5

  return jdn
}

// converts a hijri date to a gregorian date
const hijriToGregorian = (hy, hm, hd) => {
  const julianDate = hijriToJulian(hy, hm, hd)
  const gregorianDate = julianToGregorian(julianDate)
  return gregorianDate
}

//  JD_TO_GREGORIAN  --  Calculate Gregorian calendar date from Julian day
const julianToGregorian = (jd) => {
  let wjd,
    depoch,
    quadricent,
    dqc,
    cent,
    dcent,
    quad,
    dquad,
    yindex,
    dyindex,
    year,
    yearday,
    leapadj,
    month,
    day

  wjd = Math.floor(jd - 0.5) + 0.5
  depoch = wjd - GREGORIAN_EPOCH
  quadricent = Math.floor(depoch / 146097)
  dqc = mod(depoch, 146097)
  cent = Math.floor(dqc / 36524)
  dcent = mod(dqc, 36524)
  quad = Math.floor(dcent / 1461)
  dquad = mod(dcent, 1461)
  yindex = Math.floor(dquad / 365)
  year = quadricent * 400 + cent * 100 + quad * 4 + yindex
  if (!(cent == 4 || yindex == 4)) {
    year++
  }

  yearday = wjd - gregorianToJulian(year, 1, 1)
  leapadj =
    wjd < gregorianToJulian(year, 3, 1) ? 0 : leapGregorian(year) ? 1 : 2
  month = Math.floor(((yearday + leapadj) * 12 + 373) / 367)
  day = wjd - gregorianToJulian(year, month, 1) + 1

  return { year, month, day }
}

const FORMAT_DEFAULT = 'YYYY-MM-DDTHH:mm:ssZ'

let locale = {}

const t = (format) =>
  format.replace(/(\[[^\]]+])|(MMMM|MM|DD|dddd)/g, (_, a, b) => a || b.slice(1))

const englishFormats = {
  LTS: 'h:mm:ss A',
  LT: 'h:mm A',
  L: 'MM/DD/YYYY',
  LL: 'MMMM D, YYYY',
  LLL: 'MMMM D, YYYY h:mm A',
  LLLL: 'dddd, MMMM D, YYYY h:mm A',
}

// format function
const u = (formatStr, formats) =>
  formatStr.replace(/(\[[^\]]+])|(LTS?|l{1,4}|L{1,4})/g, (_, a, b) => {
    const B = b && b.toUpperCase()
    return a || formats[b] || englishFormats[b] || t(formats[B])
  })

const formattingTokens =
  /(\[[^[]*\])|([-_:/.,()\s]+)|(iYYYY|iYY?|YY?|MM?M?M?|iMM?M?M?|Do|iDo|DD?|iDD?)/g

// parse function for each format
const match2 = /\d\d/ // 00 - 99
const match4 = /\d{4}/ // 0000 - 9999
const match1to2 = /\d\d?/ // 0 - 99
const matchSigned = /[+-]?\d+/ // -inf - inf
const matchWord = /\d*[^-_:/,()\s\d]+/ // Word

// parse two digit year
let parseTwoDigitYear = function (input) {
  input = +input
  return input + (input > 68 ? 1900 : 2000)
}

// set property to value for parser
const addInput = function (property) {
  return function (input) {
    this[property] = +input
  }
}

// get part of locale
const getLocalePart = (name) => {
  const part = locale[name]
  return part && (part.indexOf ? part : part.s.concat(part.f))
}

// parse function for each format
const expressions = {
  iD: [match1to2, addInput('day')],
  iDD: [match2, addInput('day')],
  iDo: [
    matchWord,
    function (input) {
      const { ordinal } = locale
      ;[this.day] = input.match(/\d+/)
      if (!ordinal) return
      for (let i = 1; i <= 31; i += 1) {
        if (ordinal(i).replace(/\[|\]/g, '') === input) {
          this.day = i
        }
      }
    },
  ],
  iM: [match1to2, addInput('month')],
  iMM: [match2, addInput('month')],
  iMMM: [
    matchWord,
    function (input) {
      const months = getLocalePart('months')
      const monthsShort = getLocalePart('monthsShort')
      const matchIndex =
        (monthsShort || months.map((_) => _.slice(0, 3))).indexOf(input) + 1
      if (matchIndex < 1) {
        throw new Error()
      }
      this.month = matchIndex % 12 || matchIndex
    },
  ],
  iMMMM: [
    matchWord,
    function (input) {
      const months = getLocalePart('months')
      const matchIndex = months.indexOf(input) + 1
      if (matchIndex < 1) {
        throw new Error()
      }
      this.month = matchIndex % 12 || matchIndex
    },
  ],
  iY: [matchSigned, addInput('year')],
  iYY: [
    match2,
    function (input) {
      this.year = parseTwoDigitYear(input)
    },
  ],
  iYYYY: [match4, addInput('year')],
}

// split string by formatting tokens
function makeParser(format) {
  format = u(format, locale && locale.formats)
  const array = format.match(formattingTokens)
  const { length } = array
  for (let i = 0; i < length; i += 1) {
    const token = array[i]
    const parseTo = expressions[token]
    const regex = parseTo && parseTo[0]
    const parser = parseTo && parseTo[1]
    if (parser) {
      array[i] = { regex, parser }
    } else {
      array[i] = token.replace(/^\[|\]$/g, '')
    }
  }
  return function (input) {
    const time = {}
    for (let i = 0, start = 0; i < length; i += 1) {
      const token = array[i]
      if (typeof token === 'string') {
        start += token.length
      } else {
        const { regex, parser } = token
        const part = input.slice(start)
        const match = regex.exec(part)
        const value = match[0]
        parser.call(time, value)
        input = input.replace(value, '')
      }
    }
    return time
  }
}

// parse input string + format to date object
const parseFormattedInput = (input, format, utc) => {
  try {
    if (['x', 'X'].indexOf(format) > -1)
      return new Date((format === 'X' ? 1000 : 1) * input)
    const parser = makeParser(format)
    const result = parser(input)
    const { year, month, day } = hijriToGregorian(
      result.year,
      result.month,
      result.day,
    )
    const now = new Date()
    const d = day || (!year && !month ? now.getDate() : 1)
    const y = year || now.getFullYear()
    let M = 0
    if (!(year && !month)) {
      M = month > 0 ? month - 1 : now.getMonth()
    }
    const ret = new Date(y, M, d)
    return ret
  } catch (e) {
    return new Date('') // Invalid Date
  }
}

const hijri = (option, dayjsClass, dayjsFactory) => {
  // locale needed later
  const proto = dayjsClass.prototype
  // add property methods
  proto.iMonth = function () {
    const jdn = gregorianToJulian(this.$y, this.$M + 1, this.$D)
    const hijri = julianToHijri(jdn)
    return hijri.hm
  }
  proto.iDay = function () {
    const jdn = gregorianToJulian(this.$y, this.$M + 1, this.$D)
    const hijri = julianToHijri(jdn)
    return hijri.hd
  }
  proto.iYear = function () {
    const jdn = gregorianToJulian(this.$y, this.$M + 1, this.$D)
    const hijri = julianToHijri(jdn)
    return hijri.hy
  }
  // add format methods
  const oldFormat = proto.format
  proto.format = function (formatStr) {
    const locale = this.$locale()
    if (!this.isValid()) {
      return oldFormat.bind(this)(formatStr)
    }
    const islamicMonths =
      'محرم_صفر_ربيع الأول_ربيع الثاني_جمادى الأولى_جمادى الآخرة_رجب_شعبان_رمضان_شوال_ذو القعدة_ذو الحجة'.split(
        '_',
      )

    const utils = this.$utils()
    const str = formatStr || FORMAT_DEFAULT
    const jdn = gregorianToJulian(this.$y, this.$M + 1, this.$D)
    const hijriDate = julianToHijri(jdn)

    const result = str.replace(
      /\[([^\]]+)]|iY{1,4}|iM{1,4}|iDo|iD{1,2}|id{1,4}/g,
      (match) => {
        switch (match) {
          case 'iDo':
            return locale.ordinal(hijriDate.hd)
          case 'iYY':
            return String(hijriDate.hy).slice(-2)
          case 'iYYYY':
            return utils.s(hijriDate.hy, 4, '0')
          case 'iM':
            return hijriDate.hm + 1
          case 'iMM':
            return utils.s(hijriDate.hm + 1, 2, '0')
          case 'iMMM':
            return 'September'
          case 'iMMMM':
            return `[${islamicMonths[hijriDate.hm]}]`
          case 'iD':
            return hijriDate.hd
          case 'iDD':
            return utils.s(hijriDate.hd, 2, '0')
          case 'id':
            return 'id'
          case 'idd':
            return 'idd'
          case 'iddd':
            return 'iddd'
          case 'idddd':
            return 'idddd'
          default:
            return match
        }
      },
    )
    return oldFormat.bind(this)(result)
  }

  const oldParse = proto.parse
  proto.parse = function (cfg) {
    const { date, utc, args } = cfg
    this.$u = utc
    const format = args[1]
    if (typeof format === 'string') {
      const isStrictWithoutLocale = args[2] === true
      const isStrictWithLocale = args[3] === true
      const isStrict = isStrictWithoutLocale || isStrictWithLocale
      let pl = args[2]
      if (isStrictWithLocale) [, , pl] = args
      locale = this.$locale()
      if (!isStrictWithoutLocale && pl) {
        locale = d.Ls[pl]
      }

      this.$d = parseFormattedInput(date, format, utc)
      this.init()
      if (pl && pl !== true) this.$L = this.locale(pl).$L
      // use != to treat
      // input number 1410715640579 and format string '1410715640579' equal
      // eslint-disable-next-line eqeqeq
      if (isStrict && date != this.format(format)) {
        this.$d = new Date('')
      }
      // reset global locale to make parallel unit test
      locale = {}
    } else if (format instanceof Array) {
      const len = format.length
      for (let i = 1; i <= len; i += 1) {
        args[1] = format[i - 1]
        const result = d.apply(this, args)
        if (result.isValid()) {
          this.$d = result.$d
          this.$L = result.$L
          this.init()
          break
        }
        if (i === len) this.$d = new Date('')
      }
    } else {
      oldParse.call(this, cfg)
    }
  }
}

export default hijri
