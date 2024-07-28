import { MaxWidthWrapper } from '@/components/max-width-wrapper'
import { TEMPLATE } from '../../(main)/components/TEMPLATE'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import Image from 'next/image'
import { AiInputForm } from './components/ai-input-form'
import { AiOutputSection } from './components/ai-output-section'

interface CreateNewContentPageProps {
  params: {
    'template-slug': string
  }
}
const CreateNewContentPage = ({
  params: { 'template-slug': templateSlug },
}: CreateNewContentPageProps) => {
  const template = TEMPLATE.find((t) => t.slug === templateSlug)
  if (!template) {
    return <MaxWidthWrapper>Template not found</MaxWidthWrapper>
  }
  return (
    <MaxWidthWrapper className="py-2.5">
      <Button asChild variant="ghost">
        <Link href="/dashboard">
          <ArrowLeft> Back</ArrowLeft>
        </Link>
      </Button>
      <div className="grid grid-cols-1 gap-6 py-5 lg:grid-cols-3">
        <Card className="bg-white p-5">
          <CardContent>
            <Image src={template.icon} alt="icon" width={70} height={70} />
            <h2 className="text-2xl font-semibold text-primary">{template.name}</h2>
            <p className="text-sm text-gray-500">{template.desc}</p>
            {/* AI-input-form */}
            <AiInputForm template={template} />
          </CardContent>
        </Card>
        <Card className="bg-white p-5 lg:col-span-2">
          <AiOutputSection />
        </Card>
      </div>
    </MaxWidthWrapper>
  )
}

export default CreateNewContentPage
