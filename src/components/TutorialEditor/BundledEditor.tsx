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
  const editorStyles = `
  .tooltip {
    color: #009b77;
    display: inline-block;
    position: relative;
  }

  .tooltip:hover span {
    transform: translateY(calc(-100% - 5px)) scale(1);
  }

  .tooltip span {
    color: #000;
    position: absolute;
    top: 0;
    left: 0;
    min-width: 20rem;
    max-width: 20rem;
    background-color: #e5f5f1;
    border-radius: 4px;
    border: 1px solid #009b77;
    padding: 8px;
    box-sizing: border-box;
    box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, .0588235294);
    transition: .5s cubic-bezier(0.15, 0, 0, 1);
    transform-origin: left bottom;
    transform: translateY(calc(-100% - 5px)) scale(0);
  }

  .buttons-combination {
    display: flex;
    width: fit-content;
    flex-direction: row;
    align-items: center;
  }

  .buttons-combination__button {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .buttons-combination__button span {
    display: inline-block;
    color: #67676b;
    line-height: 2;
    border: 1px solid #96969b;
    background-color: #eff1f3;
    border-radius: 2px;
    padding: 0 4px 2px 4px;
    box-sizing: border-box;
  }

  .buttons-combination--with-arrows .buttons-combination__button:not(:last-child):after {
    display: inline-block;
    padding: 0 0px 0 0;
    width: 40px;
    background-image: url('/img/arrow-gray.svg');
    background-position: center;
    background-repeat: no-repeat;
    height: 30px;
    content: "";
  }

  .buttons-combination__button:not(:last-child):after {
    display: inline-block;
    padding: 0 0px 0 0;
    width: 40px;
    background-image: url('/img/plus.svg');
    background-position: center;
    background-repeat: no-repeat;
    height: 30px;
    content: "";
}
  `

  return (
    <>
      {props?.subchapter && props.subchapter === true ? (
        <Editor
          init={{ content_style: editorStyles }}
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
          init={{
            menubar: props.customInit && props.customInit.menubar,
            resize: props.customInit && props.customInit.resize,
            plugins: props.customInit && props.customInit.plugins,
            toolbar: props.customInit && props.customInit.toolbar,
            content_style: editorStyles,
          }}
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
