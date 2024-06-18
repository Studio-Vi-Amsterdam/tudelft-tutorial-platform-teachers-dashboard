import DashboardTutorialSection from './DashboardTutorialSection'
import AddNewTutorialButton from './AddNewTutorialButton'
import { HardcodeTestDataInterface } from 'src/types/types'
import { useEffect } from 'react'
import { articlesAPI } from 'src/lib/api'
import { useAppDispatch, useAppSelector } from 'src/redux/hooks'
import { setPublished } from 'src/redux/features/dashboardSlice'
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
    published: [
      {
        type: 'course',
        name: 'Computer Aided Design',
        lastEdit: new Date('2023-06-09'),
        published: new Date('2023-06-09'),
      },
      {
        type: 'course',
        name: 'Computer Aided Design',
        lastEdit: new Date('2023-06-09'),
        published: new Date('2023-06-09'),
      },
      {
        type: 'course',
        name: 'Computer Aided Design',
        lastEdit: new Date('2023-06-09'),
        published: new Date('2023-06-09'),
      },
      {
        type: 'course',
        name: 'Computer Aided Design',
        lastEdit: new Date('2023-06-09'),
        published: new Date('2023-06-09'),
      },
      {
        type: 'course',
        name: 'Computer Aided Design',
        lastEdit: new Date('2023-06-09'),
        published: new Date('2023-06-09'),
      },
      {
        type: 'course',
        name: 'Computer Aided Design',
        lastEdit: new Date('2023-06-09'),
        published: new Date('2023-06-09'),
      },
      {
        type: 'course',
        name: 'Computer Aided Design',
        lastEdit: new Date('2023-06-09'),
        published: new Date('2023-06-09'),
      },
      {
        type: 'course',
        name: 'Computer Aided Design',
        lastEdit: new Date('2023-06-09'),
        published: new Date('2023-06-09'),
      },
    ],
    drafts: [
      {
        type: 'course',
        name: 'Computer Aided Design',
        lastEdit: new Date('2023-06-09'),
        published: new Date('2023-06-09'),
      },
      {
        type: 'course',
        name: 'Computer Aided Design',
        lastEdit: new Date('2023-06-09'),
        published: new Date('2023-06-09'),
      },
    ],
  }

  const dispatch = useAppDispatch()
  const published = useAppSelector((state: RootState) => state.dashboard.published)

  const { isAuthenticated } = useAuth()

  /* const params = new URLSearchParams(useLocation().search);
    const auth_key = params.get('auth_key');
    const { isAuthenticated, login } = useAuth();

    const tuDelftCookieToken = getAuthToken();

    useEffect(() => {
        const fetchData = async () => {
            if (!tuDelftCookieToken) {
                if (auth_key) {
                    await login(auth_key);
                } else {
                    window.location.replace(
                        'https://alt.viamsterdam.dev/tudelft-tutorials-staging/wp/wp-admin/'
                    );
                }
            }
        };
        fetchData();
    }, [tuDelftCookieToken]); */

  useEffect(() => {
    const fetchData = async () => {
      let tutorials = []
      let courses = []
      let softwares = []
      let subjects = []

      try {
        const tutorialsResponse = await articlesAPI.getArticles('tutorials')

        tutorials = tutorialsResponse.data.map((item: any) => ({
          ...item,
          type: 'tutorials' as const,
        }))
      } catch (error) {
        console.error(error)
      }
      try {
        const coursesResponse = await articlesAPI.getArticles('courses')
        courses = coursesResponse.data.map((item: any) => ({
          ...item,
          type: 'courses' as const,
        }))
      } catch (error) {
        console.error(error)
      }
      try {
        const softwaresResponse = await articlesAPI.getArticles('softwares')
        softwares = softwaresResponse.data.map((item: any) => ({
          ...item,
          type: 'softwares' as const,
        }))
      } catch (error) {
        console.error(error)
      }
      try {
        const subjectsResponse = await articlesAPI.getArticles('subjects')
        subjects = subjectsResponse.data.map((item: any) => ({
          ...item,
          type: 'subjects' as const,
        }))
      } catch (error) {
        console.error(error)
      }
      const allData = [...tutorials, ...courses, ...softwares, ...subjects]

      allData.sort(
        (a, b) => new Date(b.publish_date).getTime() - new Date(a.publish_date).getTime(),
      )
      dispatch(setPublished(allData))
    }
    if (isAuthenticated) {
      fetchData()
    }
  }, [isAuthenticated])
  if (isAuthenticated) {
    return (
      <main className="container mx-auto mb-24 mt-20 flex flex-auto flex-col gap-y-16">
        <div className="flex flex-row items-center justify-between">
          <h2 className="font-RobotoSlab text-h2 font-light -tracking-1">
            Hello {hardcodeTestData.username}
          </h2>
          <AddNewTutorialButton />
        </div>
        {hardcodeTestData?.onboarding && (
          <section className="flex flex-col">
            <h3 className="mb-6 text-h3 -tracking-1 text-primary-skyBlue">Onboarding</h3>
            <div className="flex flex-row gap-x-6">
              {hardcodeTestData.onboarding.map((item, index) => (
                <div
                  key={index}
                  className="flex w-1/2 flex-row gap-x-8 bg-background-aliceBlue p-8"
                >
                  <div className="flex flex-col">
                    <div className="flex flex-col gap-y-4 ">
                      <h4 className="font-RobotoSlab text-2xl font-medium">{item.name}</h4>
                      <p className="text-primary-subtext">{item.text}</p>
                    </div>
                    <button className="mt-14">
                      <img src="/img/arrow-right.svg" alt={`Navigate to ${item.name}`} />
                    </button>
                  </div>
                  <div className="flex items-center justify-center">
                    <img src={item.imgSrc} className="object-contain" alt={item.name} />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
        {hardcodeTestData.published && (
          <DashboardTutorialSection heading="My published tutorials" items={published} />
        )}
        {/* {hardcodeTestData.drafts && (
                <DashboardTutorialSection
                    heading="My drafts"
                    items={hardcodeTestData.drafts}
                />
            )} */}
      </main>
    )
  } else {
    return <>You need to login!</>
  }
}

export default Dashboard
