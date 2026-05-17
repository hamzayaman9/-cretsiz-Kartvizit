'use client'
import { CardData } from '@/lib/types'
import {
  KlasikTemplate, KapakTemplate, BolunmusTemplate, GeceTemplate, YanpanelTemplate,
  MinimalTemplate, KurumsalTemplate, CembersalTemplate, SicakKartTemplate, MozaikTemplate,
  BatemanTemplate,
} from './templates'

export default function CardPreview({ data }: { data: CardData }) {
  switch (data.template) {
    case 'klasik':    return <KlasikTemplate data={data} />
    case 'kapak':     return <KapakTemplate data={data} />
    case 'bolunmus':  return <BolunmusTemplate data={data} />
    case 'gece':      return <GeceTemplate data={data} />
    case 'yanpanel':  return <YanpanelTemplate data={data} />
    case 'minimal':   return <MinimalTemplate data={data} />
    case 'kurumsal':  return <KurumsalTemplate data={data} />
    case 'cembersel': return <CembersalTemplate data={data} />
    case 'sicakkart': return <SicakKartTemplate data={data} />
    case 'mozaik':    return <MozaikTemplate data={data} />
    case 'bateman':   return <BatemanTemplate data={data} />
    default:          return <KlasikTemplate data={data} />
  }
}
