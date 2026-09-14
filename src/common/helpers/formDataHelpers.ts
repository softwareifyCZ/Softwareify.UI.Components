import { isoDateFormatRegex } from '../constants/constants'
import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'

export const objectToFormData = <T extends Record<string, unknown>>(
  obj: T,
  rootName?: string,
  ignoreList?: string[]
): FormData => {
  const formData = new FormData()

  function appendFormData(data: unknown, root: string): void {
    if (!ignore(root)) {
      root = root || ''
      if (data instanceof File) {
        formData.append(root, data)
      } else if (data instanceof dayjs) {
        formData.append(root, (data as Dayjs).toISOString())
      } else if (Array.isArray(data)) {
        for (let i = 0; i < data.length; i++) {
          appendFormData(data[i], root + '[' + i + ']')
        }
      } else if (typeof data === 'object' && data !== null) {
        for (const key in data) {
          if (Object.prototype.hasOwnProperty.call(data, key)) {
            if (root === '') {
              appendFormData((data as Record<string, unknown>)[key], key)
            } else {
              appendFormData((data as Record<string, unknown>)[key], root + '.' + key)
            }
          }
        }
      } else {
        if (data !== null && typeof data !== 'undefined') {
          formData.append(root, String(data))
        }
      }
    }
  }

  function ignore(root: string): boolean {
    return (
      Array.isArray(ignoreList) &&
      ignoreList.some(function (x) {
        return x === root
      })
    )
  }

  appendFormData(obj, rootName || '')

  return formData
}

const isIsoDateString = (value: unknown): boolean => {
  return typeof value === 'string' && isoDateFormatRegex.test(value)
}

export const datesToDayjs = <T extends Record<string, unknown>>(model: T): T => {
  if (model === null || model === undefined || typeof model !== 'object') {
    return model
  }

  const data = { ...model } as Record<string, unknown>

  for (const key of Object.keys(data)) {
    const value = data[key]
    if (isIsoDateString(value)) {
      data[key] = dayjs(value as string)
    } else if (typeof value === 'object' && value !== null) {
      data[key] = datesToDayjs(value as Record<string, unknown>)
    }
  }

  return data as T
}
