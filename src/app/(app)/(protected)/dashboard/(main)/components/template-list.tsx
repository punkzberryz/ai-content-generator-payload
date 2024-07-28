'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { TEMPLATE } from './TEMPLATE'
import { useSearchTemplateStore } from './use-search-template-store'

export const TemplateList = () => {
  const [templateList, setTemplateList] = useState(TEMPLATE)
  const { search } = useSearchTemplateStore()
  useEffect(() => {
    if (search === '') {
      setTemplateList(TEMPLATE)
      return
    }
    const filterData = TEMPLATE.filter((t) => t.name.toLowerCase().includes(search.toLowerCase()))
    setTemplateList(filterData)
  }, [search])
  return (
    <>
      {templateList.map((t, idx) => (
        <TemplateCard key={idx} {...t} />
      ))}
    </>
  )
}
export interface TemplateProps {
  name: string
  desc: string
  icon: string
  category: string
  slug: string
  aiPrompt: string
  form?: FormProps[]
}
export interface FormProps {
  label: string
  field: string
  name: string
  required?: boolean
}
const TemplateCard = ({ slug, icon, name, desc }: TemplateProps) => {
  return (
    <Link href={'/dashboard/content/' + slug}>
      <div className="flex cursor-pointer flex-col gap-3 rounded-md border bg-white p-5 shadow-md transition-all hover:scale-105">
        <Image src={icon} alt={name} width={50} height={50} />
        <h2 className="text-lg font-medium">{name}</h2>
        <p className="line-clamp-3 text-gray-500">{desc}</p>
      </div>
    </Link>
  )
}
