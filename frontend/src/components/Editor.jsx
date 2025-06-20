import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Heading from '@tiptap/extension-heading'
import { Bold, Italic, Strikethrough } from 'lucide-react'
import useThemeStore from '../store/useThemeStore'
import TextStyle from '@tiptap/extension-text-style'
import { Color } from '@tiptap/extension-color'

const Editor = ({ editorRef, setEditorContent, content }) => {
    const { isDarkMode } = useThemeStore()

    const editor = useEditor({
        extensions: [
            StarterKit,
            TextStyle,
            Color
        ],
        editorProps: {
            attributes: {
                class: `prose prose-sm sm:prose lg:prose-lg leading-relaxed min-h-40 focus:outline-none p-2  ${isDarkMode ? 'text-white bg-gray-800' : 'text-black bg-gray-300'}`,
            },
        },
        content: content || '',
        onUpdate: ({ editor }) => {
            setEditorContent((prev) => prev = editor.getHTML())
        },
    })

    if (!editor) return null


    function rgbToHex(rgb) {
        if (!rgb) return '#000000'
        if (!rgb || !rgb.startsWith('rgb')) return rgb

        const result = rgb.match(/\d+/g)
        if (!result || result.length < 3) return rgb

        return (
            '#' +
            result
                .slice(0, 3)
                .map(x => parseInt(x).toString(16).padStart(2, '0'))
                .join('')
        )
    }

    return (
        <div className="border rounded-md p-4">
            <div className={`mb-2 pb-1 border-b-2 border-b-gray-400 w-fit flex items-center`}>
                <div className='flex gap-2'>
                    <button
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        className={`rounded-sm cursor-pointer px-1 ${editor.isActive('bold') ? 'font-bold text-white bg-gray-600' : ''}`}
                        type="button"
                    >
                        <Bold className='h-5' />
                    </button>
                    <button
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        className={`rounded-sm cursor-pointer px-1 ${editor.isActive('italic') ? 'font-bold text-white bg-gray-600' : ''}`}
                        type="button"
                    >
                        <Italic className='h-5' />
                    </button>
                    <button
                        onClick={() => editor.chain().focus().toggleStrike().run()}
                        className={`rounded-sm cursor-pointer px-1 ${editor.isActive('strike') ? 'font-bold text-white bg-gray-600' : ''}`}
                        type="button"
                    >
                        <Strikethrough className='h-5' />
                    </button>
                </div>
                <div className='border border-gray-400 h-4 mx-3' />
                <div className="flex gap-2 items-center">
                    <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-black'}`}>Color</span>
                    <input
                        type="color"
                        onInput={event => editor.chain().focus().setColor(event.target.value).run()}
                        value={rgbToHex(editor.getAttributes('textStyle').color)}
                        data-testid="setColor"
                    />
                </div>

            </div>
            <EditorContent ref={editorRef} editor={editor} />
        </div>
    )
}

export default Editor
