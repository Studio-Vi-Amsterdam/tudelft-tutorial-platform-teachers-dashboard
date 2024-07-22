import React from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/Popover'
import { Button } from '../ui/Button'
import { LogoutIcon } from '../ui/Icons'
import { useAuth } from 'src/lib/AuthContext'

interface ProfilePillProps {
  isMobileView: boolean
  setIsShowNav: (value: React.SetStateAction<boolean>) => void
}

const ProfilePill = (props: ProfilePillProps) => {
  const { isMobileView, setIsShowNav } = props
  const { username, logout } = useAuth()
  return (
    <Popover>
      <PopoverTrigger>
        <div className="sm:ml-10 flex items-center justify-between ">
          <div className=" flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-secondary-navy text-white">
            {username !== 'there' ? username[0].toUpperCase() : 'U'}
          </div>
          {isMobileView && (
            <div
              onClick={() => setIsShowNav(false)}
              className="after:absolute cursor-pointer w-6 h-6 relative after:content-[''] after:top-1/2 after:left-1/2 after:w-full after:h-0.5 after:bg-black after:-translate-x-1/2 after:-translate-y-1/2 after:rotate-45 before:absolute  before:content-[''] before:top-1/2 before:left-1/2 before:w-full before:h-0.5 before:bg-black before:-translate-x-1/2 before:-translate-y-1/2 before:-rotate-45"
            ></div>
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent className="flex flex-col justify-between items-start gap-y-3">
        <h3>Hi, {username}!</h3>
        <Button className="w-full" size={'sm'} onClick={logout}>
          <LogoutIcon color="white" />
          Log out
        </Button>
      </PopoverContent>
    </Popover>
  )
}

export default ProfilePill
