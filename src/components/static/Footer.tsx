import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className=" relative">
      <div className="absolute top-0 left-0 w-full h-full z-[-1] bg-background-aliceBlue">
        <img className="w-full h-full object-cover" src="/img/footer.svg" alt="footer bg" />
      </div>
      <div className="container mx-auto md:pb-14 md:pt-20 pt-10 pb-12 flex justify-between gap-y-14 gap-8 max-lg:flex-wrap">
        <div className="flex flex-col gap-8 lg:flex-row justify-between sm:order-2 lg:w-2/6 sm:w-2/4">
          <div className="flex flex-col gap-y-4">
            <h2 className="text-xl font-bold leading-6 -tracking-1">DigiPedia</h2>
            <p className="text-base">
              Your gateway to mastering cutting-edge
              <br /> tools and technologies at your own pace,
              <br /> propelling your skills to new heights
            </p>
          </div>
        </div>
        <nav className="flex flex-row gap-x-6 max-sm:w-full [&>ul]:flex max-sm:[&>ul]:w-full sm:[&>ul]:min-w-[184px] sm:order-3 [&>ul]:flex-col sm:[&>ul]:gap-y-4 [&>ul]:gap-y-6">
          <ul>
            <li className="first:font-bold">Tutorials</li>
            <li>
              <Link
                to={'/courses'}
                className="text-black hover:text-primary-skyBlue transition-all"
              >
                Courses
              </Link>
            </li>
            <li>
              <Link
                to={'/subjects'}
                className="text-black hover:text-primary-skyBlue transition-all"
              >
                Subjects
              </Link>
            </li>
            <li>
              <Link
                to={'/software'}
                className="text-black hover:text-primary-skyBlue transition-all"
              >
                Software
              </Link>
            </li>
            <li>
              <Link to={'/labs'} className="text-black hover:text-primary-skyBlue transition-all">
                Labs
              </Link>
            </li>
          </ul>
          <ul>
            <li className="first:font-bold">About</li>
            <li>
              <Link to={'/about'} className="text-black hover:text-primary-skyBlue transition-all">
                About
              </Link>
            </li>
            <li>
              <Link
                to={'/feedback'}
                className="text-black hover:text-primary-skyBlue transition-all"
              >
                Feedback
              </Link>
            </li>
          </ul>
        </nav>
        <div className="flex flex-col justify-end gap-y-10 sm:order-1">
          <img src="/img/TU_P5_white.svg" alt="tuDelft Logo" className="h-[72px] w-[182px]" />
          <div className="flex flex-row gap-x-4 whitespace-nowrap text-xs leading-5">
            <p>2024 All rights reserved</p>
            <a>privacy policy</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
