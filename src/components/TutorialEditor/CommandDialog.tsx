import React from 'react'
import { Dialog, DialogContent, DialogFooter } from '../ui/Dialog'
import EditorLabel from '../ui/EditorLabel'
import TextInput from '../ui/TextInput'
import { Button } from '../ui/Button'
import { CommandDialogInterface } from 'src/types/types'

interface CommandDialogProps {
  setCommandDialog: React.Dispatch<React.SetStateAction<CommandDialogInterface>>
  commandDialog: CommandDialogInterface
  setCommandDialogOpened: (val: boolean) => void
  handleSubmitCommand: () => void
}

const CommandDialog = (props: CommandDialogProps) => {
  const { commandDialog, setCommandDialog, setCommandDialogOpened, handleSubmitCommand } = props
  return (
    <Dialog open={commandDialog.isOpen} onOpenChange={setCommandDialogOpened}>
      <DialogContent className="bg-white">
        <EditorLabel>Type your command or tool here:</EditorLabel>
        <TextInput
          placeholder="Type the cmd / tool here"
          value={commandDialog.fields[0]}
          handleChange={(val: string) =>
            setCommandDialog({
              ...commandDialog,
              fields: commandDialog.fields.map((el, index) => (index === 0 ? (el = val) : el)),
            })
          }
        />
        <EditorLabel>For multiple, select the relation:</EditorLabel>
        <div className="flex w-full flex-row gap-x-6">
          <Button
            variant={commandDialog.separator === 'plus' ? 'elements' : 'outline'}
            className="items-center"
            onClick={() =>
              setCommandDialog({
                ...commandDialog,
                separator: 'plus',
              })
            }
          >
            <div>+</div>
            <p>press at the same time</p>
          </Button>
          <Button
            variant={commandDialog.separator === 'arrow' ? 'elements' : 'outline'}
            className="items-center"
            onClick={() =>
              setCommandDialog({
                ...commandDialog,
                separator: 'arrow',
              })
            }
          >
            <div>→</div>
            <p>press after each other</p>
          </Button>
        </div>
        <TextInput
          placeholder="Type the cmd / tool here"
          value={commandDialog.fields[1]}
          handleChange={(val: string) =>
            setCommandDialog({
              ...commandDialog,
              fields: commandDialog.fields.map((el, index) => (index === 1 ? (el = val) : el)),
            })
          }
        />
        {commandDialog.fields[1].length > 0 && (
          <TextInput
            placeholder="Type the cmd / tool here"
            value={commandDialog.fields[2]}
            handleChange={(val: string) =>
              setCommandDialog({
                ...commandDialog,
                fields: commandDialog.fields.map((el, index) => (index === 2 ? (el = val) : el)),
              })
            }
          />
        )}
        <DialogFooter>
          <Button
            onClick={handleSubmitCommand}
            disabled={
              commandDialog.fields[0].length === 0 ||
              (commandDialog.fields[1].length > 0 && commandDialog.separator === '')
            }
          >
            <p>Start</p>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default CommandDialog
