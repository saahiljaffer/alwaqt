import { PluginFunc } from 'dayjs'

declare const plugin: PluginFunc
export = plugin

declare module 'dayjs' {
  interface Dayjs {
    iYear(): number
    iMonth(): number
    iDay(): number
  }
}
