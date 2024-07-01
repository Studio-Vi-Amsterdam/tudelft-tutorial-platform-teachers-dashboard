import DashboardTutorialSection from './DashboardTutorialSection'
import AddNewTutorialButton from './AddNewTutorialButton'
import {
  ArtictesType,
  DashboardPublishedInterface,
  HardcodeTestDataInterface,
} from 'src/types/types'
import { useEffect, useState } from 'react'
import { articlesAPI, userAPI } from 'src/lib/api'
import { useAppDispatch, useAppSelector } from 'src/redux/hooks'
import { setDashboardFetched, setDrafts, setPublished } from 'src/redux/features/dashboardSlice'
import { RootState } from 'src/redux/store'
import { useAuth } from 'src/lib/AuthContext'

const Dashboard = () => {
  const hardcodeTestData: HardcodeTestDataInterface = {
    username: 'James',
    onboarding: [
      {
        name: 'Onboarding Video',
        text: 'This video will show you how to create a tutorial.',
        link: '',
        imgSrc: '/img/dashboard/onboarding-video.svg',
      },
      {
        name: 'Guidelines',
        text: 'Read this guidelines to create a tutorial according to the teaching objectives.',
        link: '',
        imgSrc: '/img/dashboard/onboarding-guidelines.svg',
      },
    ],
  }

  const dispatch = useAppDispatch()
  const published = useAppSelector((state: RootState) => state.dashboard.published)
  const drafts = useAppSelector((state: RootState) => state.dashboard.drafts)
  const isDraftsFetched = useAppSelector((state: RootState) => state.dashboard.isDraftsLoaded)
  const isPublishedFetched = useAppSelector((state: RootState) => state.dashboard.isPublishedLoaded)
  const { isAuthenticated } = useAuth()
  const [username, setUsername] = useState<string>('there')

  useEffect(() => {
    const fetchPreviewLink = async (type: ArtictesType, id: number): Promise<string | null> => {
      try {
        const response = await articlesAPI.getPreviewLink(type, id)
        return response.data.preview_link || null
      } catch (error) {
        console.error(`Error fetching preview link for ${type} with id ${id}:`, error)
        return null
      }
    }

    const fetchUsername = async () => {
      try {
        const response = await userAPI
          .getUser()
          .then((res) => (res.data.first_name ? res.data.first_name : 'there'))
        setUsername(response)
      } catch (error) {
        return 'there'
      }
    }

    const addPreviewLinks = async (
      articles: DashboardPublishedInterface[],
    ): Promise<DashboardPublishedInterface[]> => {
      const articlesWithPreviewLinks = await Promise.all(
        articles.map(async (article) => {
          const previewLink = await fetchPreviewLink(article.type, article.id)
          return { ...article, previewLink }
        }),
      )
      return articlesWithPreviewLinks
    }

    const fetchData = async () => {
      await fetchUsername()
      const fetchArticles = async (type: ArtictesType): Promise<DashboardPublishedInterface[]> => {
        try {
          const response = await articlesAPI.getArticles(type)
          return response.data.map((item: any) => ({
            ...item,
            type,
            status: 'published',
          }))
        } catch (error: any) {
          console.error(error)
          return []
        }
      }

      const fetchDraftArticles = async (
        type: ArtictesType,
      ): Promise<DashboardPublishedInterface[]> => {
        try {
          const response = await articlesAPI.getDraftArticles(type)
          return response.data.map((item: any) => ({
            ...item,
            type,
            status: 'draft',
          }))
        } catch (error) {
          console.error(error)
          return []
        }
      }

      const articleTypes: ArtictesType[] = ['tutorials', 'courses', 'softwares', 'subjects']

      dispatch(setDashboardFetched({ row: 'published', value: false }))
      dispatch(setDashboardFetched({ row: 'drafts', value: false }))

      const [publishedArticles, draftArticles] = await Promise.all([
        Promise.all(articleTypes.map(fetchArticles)).then((results) => results.flat()),
        Promise.all(articleTypes.map(fetchDraftArticles)).then((results) => results.flat()),
      ])

      const sortByDate = (a: DashboardPublishedInterface, b: DashboardPublishedInterface) =>
        new Date(b.publish_date).getTime() - new Date(a.publish_date).getTime()

      let sortedPublishedArticles = publishedArticles.sort(sortByDate)
      let sortedDraftArticles = draftArticles.sort(sortByDate)

      sortedPublishedArticles = await addPreviewLinks(sortedPublishedArticles)
      sortedDraftArticles = await addPreviewLinks(sortedDraftArticles)

      dispatch(setPublished(sortedPublishedArticles))
      dispatch(setDashboardFetched({ row: 'published', value: true }))
      dispatch(setDrafts(sortedDraftArticles))
      dispatch(setDashboardFetched({ row: 'drafts', value: true }))
    }

    if (isAuthenticated) {
      fetchData()
    }
  }, [isAuthenticated, dispatch])

  if (isAuthenticated) {
    return (
      <main className="container mx-auto mt-14 mb-20 sm:mb-24 sm:mt-20 flex flex-auto flex-col gap-16 sm:gap-y-16">
        <div className="sm:flex flex-row items-center justify-between max-sm:mb-4">
          <h2 className="font-RobotoSlab text-4xl sm:text-h2 font-light -tracking-1 sm:mb-0 mb-8 ">
            Hello {username}!
          </h2>
          <AddNewTutorialButton />
        </div>
        {hardcodeTestData?.onboarding && (
          <section className="flex flex-col">
            <h3 className="mb-6 text-h3 -tracking-1 text-primary-skyBlue max-sm:text-2xl">
              Onboarding
            </h3>
            <div className=" grid lg:grid-cols-2 gap-6">
              {hardcodeTestData.onboarding.map((item, index) => (
                <div
                  key={index}
                  className="flex sm:flex-row flex-col-reverse justify-between gap-x-8 bg-background-aliceBlue p-6 sm:p-8 rounded"
                >
                  <div className="flex flex-col">
                    <div className="flex flex-col gap-y-4 ">
                      <h4 className="font-RobotoSlab text-2xl font-medium">{item.name}</h4>
                      <p className="text-[#666666]">{item.text}</p>
                    </div>
                    <button className="sm:mt-14 mt-6 ">
                      <img src="/img/arrow-right.svg" alt={`Navigate to ${item.name}`} />
                    </button>
                  </div>
                  <div className="flex items-center sm:justify-center sm:mb-0 mb-6 max-sm:w-[160px]">
                    <img src={item.imgSrc} className="object-contain w-full" alt={item.name} />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
        {published && (
          <DashboardTutorialSection
            heading="My published tutorials"
            items={published}
            fetched={isPublishedFetched}
          />
        )}

        {drafts && (
          <DashboardTutorialSection heading="My drafts" items={drafts} fetched={isDraftsFetched} />
        )}
      </main>
    )
  } else {
    return <>You need to login!</>
  }
}

export default Dashboard
