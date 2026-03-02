import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/Dialog'

const AddNewTutorialButton = () => {
  const [activeButton, setActiveButton] = useState<any>(undefined)
  const navigate = useNavigate()
  const buttons: Array<any> = [
    {
      title: 'Course page',
      type: 'courses'
    },
    {
      title: 'Subject page',
      type: 'subjects'
    },
    {
      title: 'Software page',
      type: 'softwares'
    },
    {
      title: 'Tutorial page',
      type: 'tutorials'
    },
    {
      title: 'OER Page',
      type: 'resources'
    },
  ]
  const handleChangeButton = (item: string) => {
    if (activeButton === item) {
      setActiveButton(undefined)
    } else {
      setActiveButton(item)
    }
  }

  const handleSubmit = () => {
    if (activeButton) {
      const type = activeButton.type !== 'resources' ? 'my-tutorials' : 'my-resources'
      navigate(
        `/dashboard/${type}?type=${activeButton?.type}&id=new&status=new`,
      )
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <div>+</div>
          <p>Create new page</p>
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-white sm:max-w-[888px] p-10">
        <DialogHeader>
          <DialogTitle>What are you creating?</DialogTitle>
        </DialogHeader>
        <div className="grid sm:grid-cols-2 gap-6 pb-6 sm:pb-20 mt-6">
          {buttons.map((item, index) => (
            <button
              key={index}
              onClick={() => handleChangeButton(item)}
              className={`${
                item.type === activeButton?.type ? 'border-primary-skyBlue' : 'border-transparent'
              }  border bg-background-aliceBlue p-6 sm:py-11 text-left text-xl leading-8 transition-colors duration-200`}
            >
              {item.title}
            </button>
          ))}
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit} disabled={!activeButton} className="px-10">
            <p>Start</p>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default AddNewTutorialButton
