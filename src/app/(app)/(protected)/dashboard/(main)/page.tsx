import { SearchIcon } from 'lucide-react'
import { TemplateSearchInput } from './components/template-search-input'
import { TemplateList } from './components/template-list'

const DageboardPage = () => {
  return (
    <div>
      <section
        id="template-search-section"
        className="flex flex-col items-center justify-center space-y-6 bg-gradient-to-br from-primary via-primary/70 to-secondary/10 p-10"
      >
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white">Browse All Templates</h2>
          <p>What would you like to create today?</p>
        </div>
        <TemplateSearchInput />
      </section>
      <section
        id="template-list-section"
        className="grid grid-cols-2 gap-5 p-10 md:grid-cols-3 lg:grid-cols-4"
      >
        <TemplateList />
      </section>
    </div>
  )
}

export default DageboardPage
