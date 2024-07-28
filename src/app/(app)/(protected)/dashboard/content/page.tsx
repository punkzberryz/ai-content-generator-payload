import { redirect } from 'next/navigation'

import { TEMPLATE } from '../(main)/components/TEMPLATE'

const ContentPage = () => {
  redirect('/dashboard/content/' + TEMPLATE[0].slug)
}

export default ContentPage
