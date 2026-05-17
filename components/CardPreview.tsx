'use client'
import { CardData } from '@/lib/types'
import { templateConfigMap } from '@/lib/templateConfigs'
import ConfigurableTemplate from './ConfigurableTemplate'
import {
  KlasikTemplate, KapakTemplate, BolunmusTemplate, GeceTemplate, YanpanelTemplate,
  MinimalTemplate, KurumsalTemplate, CembersalTemplate, SicakKartTemplate, MozaikTemplate,
  BatemanTemplate, GradientTemplate, NeonTemplate, RetroTemplate, CamTemplate,
  BoldTemplate, IkiRenkTemplate, SerbstTemplate,
} from './templates'

export default function CardPreview({ data }: { data: CardData }) {
  const config = templateConfigMap[data.template]
  if (config) return <ConfigurableTemplate data={data} config={config} />

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
    case 'gradient':  return <GradientTemplate data={data} />
    case 'neon':      return <NeonTemplate data={data} />
    case 'retro':     return <RetroTemplate data={data} />
    case 'cam':       return <CamTemplate data={data} />
    case 'bold':      return <BoldTemplate data={data} />
    case 'ikirenk':   return <IkiRenkTemplate data={data} />
    case 'serbest':   return <SerbstTemplate data={data} />
    default:          return <KlasikTemplate data={data} />
  }
}
