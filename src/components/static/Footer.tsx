import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="bg-background-aliceBlue">
      <div className="container mx-auto pb-14 pt-20">
        <div className="flex flex-row justify-between">
          <div className="flex flex-row gap-x-24">
            <div className="flex flex-col justify-end gap-y-10">
              <img src="/img/TU_P5_white.svg" alt="tuDelft Logo" className="h-[72px] w-[182px]" />
              <div className="flex flex-row gap-x-4 whitespace-nowrap text-xs leading-5">
                <p>2024 All rights reserved</p>
                <a>privacy policy</a>
              </div>
            </div>
            <div className="flex flex-col gap-y-4">
              <h2 className="text-xl font-bold leading-6 -tracking-1">DigiPedia</h2>
              <p className="text-base">
                Your gateway to mastering cutting-edge
                <br /> tools and technologies at your own pace,
                <br /> propelling your skills to new heights
              </p>
            </div>
          </div>
          <nav className="flex flex-row gap-x-6 [&>ul]:flex [&>ul]:min-w-[184px] [&>ul]:flex-col [&>ul]:gap-y-4">
            <ul>
              <li className="first:font-bold">Tutorials</li>
              <li>
                <Link to={'/courses'}>Courses</Link>
              </li>
              <li>
                <Link to={'/subjects'}>Subjects</Link>
              </li>
              <li>
                <Link to={'/software'}>Software</Link>
              </li>
              <li>
                <Link to={'/labs'}>Labs</Link>
              </li>
            </ul>
            <ul>
              <li className="first:font-bold">About</li>
              <li>
                <Link to={'/about'}>About</Link>
              </li>
              <li>
                <Link to={'/feedback'}>Feedback</Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  )
}

export default Footer
