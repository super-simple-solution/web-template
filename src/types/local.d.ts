export interface OpOption {
  name: Op
  option?: object
}

type OpData = {
  op: string
  label: string
  attr?: any
}

export type Op = 'add' | 'edit' | 'search' | 'delete' | any

interface TableConfig {
  selection?: boolean
  index?: boolean
  list: any[]
  operations?: (string | OpData)[]
}

interface TableAttrs {
  class?: string
}

interface RowInfo {
  id?: string | number
  [key: string]: any
}

type DataOptions = {
  [key: string]: string | number | boolean | null
}

interface Location {
  lng: number
  lat: number
}
