import { Info, Pen } from 'lucide-react'
import React, { useRef, useState } from 'react'
import Editor from './Editor'
import useProjectStore from '../store/useProjectStore'
import toast from 'react-hot-toast'

const Description = ({ description, projectId }) => {
    const { updateProject, error } = useProjectStore()
    const [editorContent, setEditorContent] = useState(description)
    const [edit, setEdit] = useState(false)
    const editorRef = useRef()

    const handleSave = async () => {
        const payload = {}
        if (description === editorContent) {
            setEdit(false)
            return
        }
        payload.description = editorContent
        await updateProject(projectId, payload)
        if (error) {
            toast(error, {
                style: { backgroundColor: "red", color: "white" },
                duration: 2000
            })
            return
        }

        setEdit(false)
        toast("Project Updated", {
            style: { backgroundColor: "green", color: "white" },
            duration: 1000
        })
        setEdit(false)
    }

    return (
        <div>
            <div className="flex gap-2 items-center mb-2">
                <Info className="w-5 h-5 text-blue-500 mt-1" />
                <h2 className="text-xl font-semibold text-blue-500">Description</h2>
                <div className='flex items-center justify-center'>
                    {
                        !edit ?
                            <div className='tooltip' data-tip="Edit">
                                <Pen className='h-4 text-red-700 cursor-pointer hover:scale-[105%]' onClick={() => setEdit(true)} />
                            </div>
                            : <button className='text-xs btn btn-xs bg-green-700' onClick={handleSave}>Save</button>
                    }
                </div>
            </div>
            <div className='min-h-[400px]'>
                {
                    !edit ?
                        <p className="whitespace-pre-line leading-relaxed " dangerouslySetInnerHTML={{ __html: description }}>
                            {/* {description} */}
                        </p>
                        :
                        <Editor setEditorContent={setEditorContent} content={description} editorRef={editorRef} />
                }
            </div>
        </div>
    )
}

export default Description