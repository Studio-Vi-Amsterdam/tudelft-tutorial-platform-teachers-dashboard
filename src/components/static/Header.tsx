import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

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
                  onClick={() => navigate('dashboard')}
                  className={`${
                    pathname.split('/').find((item) => item === 'media')
                      ? 'text-tertiary-grey-dim before:bg-transparent'
                      : 'text-primary before:bg-black'
                  } max-sm:!text-2xl`}
                >
                  My Tutorials
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('dashboard/media')}
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
            <div className="sm:ml-10 flex items-center justify-between ">
              <div className=" flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-secondary-navy text-white">
                ML
              </div>
              {isMobileView && (
                <div
                  onClick={() => setIsShowNav(false)}
                  className="after:absolute cursor-pointer w-6 h-6 relative after:content-[''] after:top-1/2 after:left-1/2 after:w-full after:h-0.5 after:bg-black after:-translate-x-1/2 after:-translate-y-1/2 after:rotate-45 before:absolute  before:content-[''] before:top-1/2 before:left-1/2 before:w-full before:h-0.5 before:bg-black before:-translate-x-1/2 before:-translate-y-1/2 before:-rotate-45"
                ></div>
              )}
            </div>
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
