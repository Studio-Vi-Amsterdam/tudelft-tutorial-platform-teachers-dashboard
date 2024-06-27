import { DashboardSectionProps } from 'src/types/types'
import DashboardCard from './DashboardCard'
import Preloader from '../ui/Preloader'

const DashboardTutorialSection = (props: DashboardSectionProps) => {
  const { items, heading, fetched } = props
  return (
    <section className="flex flex-col">
      <h3 className="mb-6 text-h3 -tracking-1 text-primary-skyBlue">{heading}</h3>
      {fetched ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.length !== 0 ? (
            items.map((item, index) => (
              <DashboardCard item={item} key={index} draft={heading === 'My drafts'} />
            ))
          ) : (
            <>No published articles</>
          )}
        </div>
      ) : (
        <Preloader color={'secondary'} />
      )}
    </section>
  )
}

export default DashboardTutorialSection
