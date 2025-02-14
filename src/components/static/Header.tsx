import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import ProfilePill from './ProfilePill'
import { Notification } from './Notification'

const Header = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [pathname, setPathname] = useState<string | undefined>(undefined)
  const [isMobileView, setIsMobileView] = useState<boolean>(false)
  const [isShowNav, setIsShowNav] = useState<boolean>(false)
  useEffect(() => {
    if (location?.pathname) {
      setPathname(location.pathname)
    }
  }, [location])
  useEffect(() => {
    window.innerWidth > 639 ? setIsMobileView(false) : setIsMobileView(true)
  }, [])
  return (
    <header className="z-50  bg-white py-5 border-b boder-2 border-[#EFF1F3]">
      <div className="container mx-auto flex flex-row items-center justify-between">
        {pathname && (
          <h1 className="flex text-2xl font-bold leading-[30px] -tracking-6 ">
            <p onClick={() => navigate('/')} className="cursor-pointer">
              DigiPedia{' '}
            </p>
            <span className="ml-1 font-normal text-primary-skyBlue">Dashboard</span>
          </h1>
        )}

        {pathname && (
          <nav
            className={`${isMobileView ? 'fixed top-0 left-0 w-full h-screen overflow-y-auto bg-white py-4 px-6 flex flex-col-reverse justify-end gap-8 transition-all duration-500' : 'flex flex-row items-center'} ${isShowNav ? 'max-sm:translate-x-0' : 'max-sm:translate-x-full'} `}
          >
            <ul className="flex flex-col sm:flex-row sm:gap-0 gap-6 [&>li>button]:relative [&>li>button]:text-base [&>li>button]:transition-all [&>li>button]:duration-300 [&>li>button]:before:absolute [&>li>button]:before:-bottom-[6px] [&>li>button]:before:h-[2px] [&>li>button]:before:w-full [&>li>button]:before:transition-all [&>li>button]:before:duration-300 [&>li]:cursor-pointer  sm:[&>li]:px-8">
              <li>
                <button
                  onClick={() => {
                    navigate('dashboard')
                    setIsShowNav(false)
                  }}
                  className={`${
                    pathname.split('/').find((item) => item === 'media')
                      ? 'text-tertiary-grey-dim before:bg-transparent'
                      : 'text-primary before:bg-black'
                  } max-sm:!text-2xl`}
                >
                  My pages
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    navigate('dashboard/media')
                    setIsShowNav(false)
                  }}
                  className={`${
                    pathname.split('/').find((item) => item === 'media')
                      ? 'text-primary before:bg-black'
                      : 'text-tertiary-grey-dim before:bg-transparent'
                  } max-sm:!text-2xl`}
                >
                  Media
                </button>
              </li>
            </ul>

            <Notification />
            <ProfilePill isMobileView={isMobileView} setIsShowNav={setIsShowNav} />
          </nav>
        )}
        {isMobileView && (
          <div className="w-6 cursor-pointer" onClick={() => isMobileView && setIsShowNav(true)}>
            <img className="w-full" src="/img/burger.svg" alt="burger" />
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
