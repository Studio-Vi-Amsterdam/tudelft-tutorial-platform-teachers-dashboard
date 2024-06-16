import { DashboardSectionProps } from 'src/types/types'
import DashboardCard from './DashboardCard'

const DashboardTutorialSection = (props: DashboardSectionProps) => {
  const { items, heading } = props
  return (
    <section className="flex flex-col">
      <h3 className="mb-6 text-h3 -tracking-1 text-primary-skyBlue">{heading}</h3>
      <div className="flex w-full flex-row flex-wrap justify-start gap-x-6 gap-y-6">
        {items.length !== 0 ? (
          items.map((item, index) => <DashboardCard item={item} key={index} />)
        ) : (
          <>No published articles</>
        )}
      </div>
    </section>
  )
}

export default DashboardTutorialSection
