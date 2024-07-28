import { MaxWidthWrapper } from '@/components/max-width-wrapper'
import { TEMPLATE } from '../../(main)/components/TEMPLATE'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

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
    </MaxWidthWrapper>
  )
}

export default CreateNewContentPage
