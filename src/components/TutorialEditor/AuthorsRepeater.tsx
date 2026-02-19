import React, { useEffect, useState } from "react"
import { Button } from "../ui/Button"
import { ResourcePerson } from '@/types/types'


interface AuthorsRepeaterProps {
  value?: ResourcePerson[]
  onChange?: (value: ResourcePerson[]) => void
  buttonTitle?: string
  labelAuthor?: string
}

const AuthorsRepeater: React.FC<AuthorsRepeaterProps> = ({
  value,
  onChange,
  buttonTitle = 'author',
  labelAuthor = 'Author',
                                                         }) => {
  const [authors, setAuthors] = useState<ResourcePerson[]>(value ?? [])

  useEffect(() => {
    setAuthors(value ?? [])
  }, [value])

  const emitChange = (next: ResourcePerson[]) => {
    setAuthors(next)
    onChange?.(next)
  }

  const onChangeAuthor = (index: number, field: keyof ResourcePerson, val: string) => {
    const next = [...authors]
    next[index] = { ...next[index], [field]: val }
    emitChange(next)
  }

  const setOrcidField = (index: number, val: string) => {
    const next = [...authors]
    const current = next[index]
    next[index] = {
      ...current,
      orcid: val,
    }
    emitChange(next)
  }

  const onAdd = () => {
    emitChange([...authors, { author: "", orcid: '' }])
  }

  const onRemove = (index: number) => {
    emitChange(authors.filter((_, i) => i !== index))
  }

  return (
    <div className="w-full">
      <div className="flex flex-col gap-6">
        {authors.map((item, idx) => (
          <div key={idx}>
            <div className="grid grid-cols-[160px_1fr] gap-x-6 gap-y-3 items-center">
              <label className="text-sm">
                {labelAuthor}<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className={`${!item.author ? 'border-red-500' : ''} w-full rounded border px-4 py-3`}
                placeholder={labelAuthor}
                value={item.author}
                onChange={(e) =>
                  onChangeAuthor(idx, 'author', e.target.value)
                }
              />

              <label className="text-sm">ORCID ID</label>
              <input
                type="text"
                className={`w-full rounded border px-4 py-3`}
                placeholder="ORCID ID"
                value={item.orcid}
                onChange={(e) =>
                  setOrcidField(idx, e.target.value)
                }
              />
            </div>

            {authors.length > 1 && (
              <div className="mt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => onRemove(idx)}
                  className="text-sm text-red-600 hover:underline"
                >
                  Remove
                </button>
              </div>
            )}
          </div>
        ))}

        <Button variant="dashed" onClick={onAdd}>
          <div>+</div>
          <p>Add {buttonTitle}</p>
        </Button>
      </div>
    </div>
  )
}

export default AuthorsRepeater
