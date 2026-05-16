'use client'
import { CardData } from '@/lib/types'
import {
  KlasikTemplate,
  KapakTemplate,
  BolunmusTemplate,
  GeceTemplate,
  YanpanelTemplate,
} from './templates'

export default function CardPreview({ data }: { data: CardData }) {
  switch (data.template) {
    case 'klasik':    return <KlasikTemplate data={data} />
    case 'kapak':     return <KapakTemplate data={data} />
    case 'bolunmus':  return <BolunmusTemplate data={data} />
    case 'gece':      return <GeceTemplate data={data} />
    case 'yanpanel':  return <YanpanelTemplate data={data} />
    default:          return <KlasikTemplate data={data} />
  }
}
