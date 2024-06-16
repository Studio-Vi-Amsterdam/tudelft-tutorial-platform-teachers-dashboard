import React from 'react'

interface EditorLabelProps {
  children: React.ReactNode
}

const EditorLabel = (props: EditorLabelProps) => {
  return <p className="my-2 font-RobotoSlab text-sm text-tertiary-grey-dim">{props.children}</p>
}

export default EditorLabel
