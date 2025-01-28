import React from 'react'
import { ArrowRight, AvatarIcon } from '../ui/Icons'
import { UserRoleType, UsersItemInterface } from 'src/types/types'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/Dropdown'
import { useAuth } from '../../lib/AuthContext'

interface AuthorsAccessRowProps {
  item: UsersItemInterface
  role: UserRoleType
  toggleRole?: (id: number) => Promise<void>
  removeEditor?: (id: number) => Promise<boolean>
}

const AuthorsAccessRow = (props: AuthorsAccessRowProps) => {
  const { item, role, removeEditor } = props
  const { userEmail } = useAuth()

  return (
    <div className="flex flex-row max-sm:flex-col max-sm:items-start items-center justify-between">
      <div className="flex flex-row items-center gap-x-2">
        <div className="w-6 h-6 text-[#292929]">
          {item.icon ? (
            <img
              src={item.icon}
              alt="Avatar"
              width={24}
              height={24}
              className="object-cover rounded-full"
            />
          ) : (
            <AvatarIcon />
          )}
        </div>
        <p className="text-black text-xl leading-[1.875rem] font-inter font-normal">
          {item.email.length === 0
            ? item.first_name
            : item.email === userEmail
              ? 'You'
              : item.email}
        </p>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger className="group capitalize flex flex-row items-center gap-x-2 text-tertiary-grey-dim text-xl leading-[1.875rem]">
          {role}
          {role !== 'owner' && (
            <span className="w-3 h-3 flex justify-center items-center transition-transform duration-200 group-data-[state='open']:rotate-90">
              <ArrowRight />
            </span>
          )}
        </DropdownMenuTrigger>
        {role !== 'owner' && (
          <DropdownMenuContent
            align="end"
            className="p-4 mt-2 flex flex-col gap-y-4 bg-background-aliceBlue rounded border-none"
          >
            {/* eslint-disable-next-line @typescript-eslint/no-empty-function */}
            <DropdownMenuItem onClick={() => (removeEditor ? removeEditor(item.id) : () => {})}>
              Remove
            </DropdownMenuItem>
          </DropdownMenuContent>
        )}
      </DropdownMenu>
    </div>
  )
}

export default AuthorsAccessRow
