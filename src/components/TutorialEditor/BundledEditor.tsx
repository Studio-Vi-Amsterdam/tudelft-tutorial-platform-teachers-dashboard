import { Editor } from '@tinymce/tinymce-react'
import { useEffect, useState } from 'react'
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
import axios from 'axios'

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
  const [styles, setStyles] = useState('')

  const getFiles = async () => {
    const res = await axios.get('/editor-styles.css')
    setStyles(res.data)
  }

  useEffect(() => {
    getFiles()
  }, [])

  const setCommandDialogOpened = (val: boolean) => {
    setCommandDialog({ ...commandDialog, isOpen: val })
  }

  const setTermDialogOpened = (val: boolean) => {
    setTermDialog({ ...termDialog, isOpen: val })
  }

  const handleSubmitTerm = () => {
    termDialog.editor.insertContent(
      `<span class='tooltip'>${termDialog.term} <span class="">${termDialog.explanation}</span></span> `,
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
  <div class='buttons-combination ${commandDialog.separator === 'arrow' ? 'buttons-combination--with-arrows' : ''} flex'>
    ${commandDialog.fields
      .map((item) =>
        item.length !== 0
          ? `<div class='buttons-combination__button flex items-center'><span class="">${item}</span></div>`
          : '',
      )
      .join('')}
  </div><br />
`,
    )

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

  const plugins = props.extended
    ? [
        'table',
        'lists',
        'link',
        'codesample',
        'autoresize',
        'command',
        'term',
        'codesample',
        'mark',
        'eqneditor',
      ]
    : ['table', 'lists', 'link', 'autoresize', 'command']

  const reducedToolbar = 'bullist numlist link bold italic underline mark table'
  const toolbar = props.extended
    ? reducedToolbar + ' codesample command term eqneditor'
    : reducedToolbar

  if (!styles) {
    return null
  }

  const errValidStyle = 'border border-red-500 rounded-md'

  return (
    <div className={`w-full ${props.notValid && errValidStyle}`}>
      <Editor
        init={{
          menubar: false,
          resize: props.extended ? true : undefined,
          plugins,
          toolbar,
          content_style: styles,
          codesample_languages: [
            { text: 'HTML/XML', value: 'markup' },
            { text: 'JavaScript', value: 'javascript' },
            { text: 'CSS', value: 'css' },
            { text: 'PHP', value: 'php' },
            { text: 'Ruby', value: 'ruby' },
            { text: 'Python', value: 'python' },
            { text: 'Java', value: 'java' },
            { text: 'C', value: 'c' },
            { text: 'C#', value: 'csharp' },
            { text: 'C++', value: 'cpp' },
          ],
        }}
        licenseKey="gpl"
        value={props.value}
        onEditorChange={
          props?.subchapter && props.subchapter === true
            ? (newValue) =>
                props.handleChange(newValue, props?.index, props?.layout, props?.subchapterIndex)
            : (newValue) => {
                props.handleChange(newValue, props?.index, props?.block)
              }
        }
        {...props}
      />
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
    </div>
  )
}
