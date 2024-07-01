import React, { useRef, useEffect } from 'react';
import CodeMirror, { EditorFromTextArea } from 'codemirror';
import 'codemirror/lib/codemirror.css';

interface CodeMirrorEditorProps {
  value: string;
  theme?: string;
  height?: Number;
  width?: Number;
  onChange: (value: string) => void;
}

const CodeMirrorEditor: React.FC<CodeMirrorEditorProps> = (props) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const editorRef = useRef<EditorFromTextArea>();

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    initCodeMirror();

    return () => {
      editorRef.current?.toTextArea();
    };
  }, []);

  const initCodeMirror = () => {
    const editorConfig = {
      lineWrapping: true,
      lineNumbers: true,
      theme: 'material'
    };

    editorRef.current = CodeMirror.fromTextArea(textareaRef.current!, editorConfig);

    editorRef.current.on('change', codemirrorValueChange);
    const { value, width, height } = props;
    editorRef.current.setValue(value || '');
    if (width || height) {
      editorRef.current.setSize(width, height);
    }
  }

  const codemirrorValueChange = (doc: any, change: any) => {
    doc.eachLine((line: any) => {
      if (line.text.startsWith('//') || line.text.startsWith('#')) {
        doc.addLineClass(line, 'wrap', 'notes');
      } else if (line.wrapClass === 'notes') {
        doc.removeLineClass(line, 'wrap', 'notes');
      }
    });
    if (change.origin !== 'setValue') {
      if (props.onChange) {
        props.onChange(doc.getValue());
      }
    }
  };

  return (
    <textarea ref={textareaRef} />
  );
};

export default CodeMirrorEditor;

