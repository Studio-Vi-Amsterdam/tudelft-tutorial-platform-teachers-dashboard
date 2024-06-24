import { Editor } from '@tinymce/tinymce-react'
import { useState } from 'react'
import { CommandDialogInterface, TermDialogInterface } from 'src/types/types'
import CommandDialog from './CommandDialog'
import TermDialog from './TermDialog'

// Required imports for Editor
import tinymce from 'tinymce'
import 'tinymce/models/dom/model'
import 'tinymce/themes/silver'
import 'tinymce/icons/default'
import 'tinymce/skins/ui/oxide/skin'
import 'tinymce/plugins/advlist'
import 'tinymce/plugins/anchor'
import 'tinymce/plugins/autolink'
import 'tinymce/plugins/autoresize'
import 'tinymce/plugins/autosave'
import 'tinymce/plugins/charmap'
import 'tinymce/plugins/code'
import 'tinymce/plugins/codesample'
import 'tinymce/plugins/directionality'
import 'tinymce/plugins/emoticons'
import 'tinymce/plugins/fullscreen'
import 'tinymce/plugins/help'
import 'tinymce/plugins/help/js/i18n/keynav/en'
import 'tinymce/plugins/image'
import 'tinymce/plugins/importcss'
import 'tinymce/plugins/insertdatetime'
import 'tinymce/plugins/link'
import 'tinymce/plugins/lists'
import 'tinymce/plugins/media'
import 'tinymce/plugins/nonbreaking'
import 'tinymce/plugins/pagebreak'
import 'tinymce/plugins/preview'
import 'tinymce/plugins/quickbars'
import 'tinymce/plugins/save'
import 'tinymce/plugins/searchreplace'
import 'tinymce/plugins/table'
import 'tinymce/plugins/visualblocks'
import 'tinymce/plugins/visualchars'
import 'tinymce/plugins/wordcount'
import 'tinymce/plugins/emoticons/js/emojis'
import 'tinymce/skins/content/default/content'
import 'tinymce/skins/ui/oxide/content'
import '@codecogs/eqneditor-tinymce6'

export default function BundledEditor(props: any) {
  const [commandDialog, setCommandDialog] = useState<CommandDialogInterface>({
    isOpen: false,
    editor: undefined,
    fields: ['', '', ''],
    separator: '',
  })
  const [termDialog, setTermDialog] = useState<TermDialogInterface>({
    isOpen: false,
    editor: undefined,
    term: '',
    select: null,
    explanation: '',
  })

  const setCommandDialogOpened = (val: boolean) => {
    setCommandDialog({ ...commandDialog, isOpen: val })
  }

  const setTermDialogOpened = (val: boolean) => {
    setTermDialog({ ...termDialog, isOpen: val })
  }

  const handleSubmitTerm = () => {
    termDialog.editor.insertContent(
      ` term:{termin:'${termDialog.term}', explanation:'${termDialog.explanation}'}`,
    )
    setTermDialog({
      isOpen: false,
      editor: undefined,
      term: '',
      select: null,
      explanation: '',
    })
  }

  const handleSubmitCommand = () => {
    commandDialog.editor.insertContent(
      `
  <div class="buttons-combination ${commandDialog.separator === 'arrow' ? 'buttons-combination--with-arrows' : ''} flex">
    ${commandDialog.fields
      .map((item) =>
        item.length !== 0
          ? `<div class="buttons-combination__button flex items-center"><span>${item}</span></div>`
          : '',
      )
      .join('')}
  </div>
`,
    )
    console.log(`
  <div class="buttons-combination ${commandDialog.separator === 'arrow' ? 'buttons-combination--with-arrows' : ''} flex">
    ${commandDialog.fields
      .map((item) =>
        item.length !== 0
          ? `<div class="buttons-combination__button flex items-center"><span>${item}</span></div>`
          : '',
      )
      .join('')}
  </div>
`)

    setCommandDialog({
      isOpen: false,
      editor: undefined,
      fields: ['', '', ''],
      separator: '',
    })
  }
  tinymce.PluginManager.add('command', (editor) => {
    const openDialog = () =>
      setCommandDialog({
        ...commandDialog,
        isOpen: true,
        editor,
      })
    editor.ui.registry.addButton('command', {
      text: 'cmd',
      onAction: () => {
        openDialog()
      },
    })
  })

  tinymce.PluginManager.add('mark', (editor) => {
    editor.ui.registry.addButton('mark', {
      icon: 'highlight-bg-color',
      onAction: () => editor.execCommand('mceToggleFormat', false, 'mark'),
    })

    editor.ui.registry.addMenuItem('mark', {
      icon: 'highlight-bg-color',
      onAction: () => editor.execCommand('mceToggleFormat', false, 'mark'),
    })

    editor.on('init', () => {
      editor.formatter.register('mark', { inline: 'mark' })
    })
  })

  tinymce.PluginManager.add('term', (editor) => {
    const openDialog = () =>
      setTermDialog({
        ...termDialog,
        isOpen: true,
        editor,
      })
    editor.ui.registry.addButton('term', {
      text: 'term',
      onAction: () => {
        openDialog()
      },
    })
  })
  return (
    <>
      {props?.subchapter && props.subchapter === true ? (
        <Editor
          licenseKey="gpl"
          value={props.value}
          onEditorChange={(newValue) =>
            props.handleChange(newValue, props?.index, props?.layout, props?.subchapterIndex)
          }
          {...props}
        />
      ) : (
        <Editor
          licenseKey="gpl"
          value={props.value}
          onEditorChange={(newValue) => props.handleChange(newValue, props?.index, props?.block)}
          {...props}
        />
      )}
      <TermDialog
        termDialog={termDialog}
        handleSubmitTerm={handleSubmitTerm}
        setTermDialog={setTermDialog}
        setTermDialogOpened={setTermDialogOpened}
      />
      <CommandDialog
        commandDialog={commandDialog}
        handleSubmitCommand={handleSubmitCommand}
        setCommandDialog={setCommandDialog}
        setCommandDialogOpened={setCommandDialogOpened}
      />
    </>
  )
}
