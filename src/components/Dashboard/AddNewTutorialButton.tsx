import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from 'src/components/ui/Button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from 'src/components/ui/Dialog'

const AddNewTutorialButton = () => {
  const [activeButton, setActiveButton] = useState<string | undefined>(undefined)
  const navigate = useNavigate()
  const buttons: Array<string> = ['Course Page', 'Subject Page', 'Software Page', 'Tutorial Page']
  const handleChangeButton = (item: string) => {
    if (activeButton === item) {
      setActiveButton(undefined)
    } else {
      setActiveButton(item)
    }
  }

  const handleSubmit = () => {
    if (activeButton) {
      navigate(
        `/dashboard/my-tutorials?type=${activeButton.split(' ')[0].toLowerCase() + 's'}&id=new&status=new`,
      )
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <div>+</div>
          <p>Create new tutorial</p>
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
                item === activeButton ? 'border-primary-skyBlue' : 'border-transparent'
              }  border bg-background-aliceBlue p-6 sm:py-11 text-left text-xl leading-8 transition-colors duration-200`}
            >
              {item}
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
