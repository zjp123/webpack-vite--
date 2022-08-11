/**
 * @description React wangEditor usage
 * @author wangfupeng
 */

import React, { FC, useState, useEffect } from 'react'
import '@wangeditor/editor/dist/css/style.css'
import { Editor, Toolbar } from '@wangeditor/editor-for-react'
import { IToolbarConfig, IEditorConfig } from '@wangeditor/editor'
import './style.less'

interface IProps {
  getContent?: (content: string) => void
  initContent?: string
  height?: number
}

const MyEditor: FC<IProps> = ({ getContent, initContent = '', height=500 }) => {
  const [editor, setEditor] = useState(null) // 存储 editor 实例
  const [html, setHtml] = useState('')

  // 模拟 ajax 请求，异步设置 html
  useEffect(() => {
    setHtml(initContent)
  }, [initContent])

  const toolbarConfig: Partial<IToolbarConfig> = {
    excludeKeys: ['headerSelect']
  }

  const editorConfig: Partial<IEditorConfig> = {
    placeholder: '请输入内容',
    MENU_CONF: {
      uploadImage: {
        base64LimitSize: 5000 * 1024 // 5000kb
      }
    }
  }

  // 及时销毁 editor
  useEffect(() => {
    return () => {
      if (editor == null) return
      editor.destroy()
      setEditor(null)
    }
  }, [])

  const onChange = editor => {
    setHtml(editor.getHtml())
    getContent(editor.getHtml())
  }

  return (
    <>
      <div style={{ border: '1px solid #ccc', zIndex: 100, marginTop: '15px' }}>
        <Toolbar editor={editor} defaultConfig={toolbarConfig} mode="default" style={{ borderBottom: '1px solid #ccc' }} />
        <Editor defaultConfig={editorConfig} value={html} onCreated={setEditor} onChange={onChange} mode="default" style={{ height: `${height}px` }} />
      </div>
    </>
  )
}

export default MyEditor
