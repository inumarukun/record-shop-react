import { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { useMutateAuth } from '../hooks/useMutateAuth'
import {
  ArrowRightEndOnRectangleIcon,
  ArrowUturnLeftIcon,
  MusicalNoteIcon,
} from '@heroicons/react/24/solid'
import useRecord from '../store'
import { useMutateRecords } from '../hooks/useMutateRecords'

export const UpdateItem = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { logoutMutation } = useMutateAuth()
  const { editedRecord } = useRecord()
  const updateRecord = useRecord((state) => state.updateEditedRecord)
  const { updateRecordMutation } = useMutateRecords()

  const logout = async () => {
    await logoutMutation.mutateAsync()
    queryClient.removeQueries(['records'])
  }

  const back = () => {
    // navigate('/recordList')
    navigate(-1)
  }

  const submitRecordHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    updateRecordMutation.mutate(editedRecord)
  }

  return (
    <div className="flex flex-col px-5 min-h-screen text-gray-600 font-mono">
      <div className="flex justify-between items-center mt-3">
        <div className="flex items-center">
          <MusicalNoteIcon className="h-6 w-6 mr-3 text-indigo-500 cursor-pointer" />
          {/* text-3xl: 文字サイズを30pxに設定、3xl=1.875rem (30px)、文字サイズのプリセット */}
          <span className="text-center text-3xl font-extrabold">
            Record Shop Manager
          </span>
        </div>
        <ArrowRightEndOnRectangleIcon
          onClick={logout}
          className="h-6 w-6 my-3 text-blue-500 cursor-pointer"
        />
      </div>
      <ArrowUturnLeftIcon
        onClick={back}
        className="h-6 w-6 my-3 text-blue-500 cursor-pointer"
      />
      <form onSubmit={submitRecordHandler}>
        <div>
          <div>
            <label className="block font-bold" htmlFor="artist">
              Artist:
            </label>
            <input
              className="autofocus border border-gray-300 focus:outline-none focus:border-blue-500  mb-2 p-2 rounded w-full"
              id="artist"
              name="artist"
              onChange={(e) =>
                updateRecord({ ...editedRecord, artist: e.target.value })
              }
              type="text"
              value={editedRecord.artist || ''}
            ></input>
          </div>
          <div>
            <label className="block font-bold" htmlFor="title">
              Title:
            </label>
            <input
              className="border border-gray-300 focus:outline-none focus:border-blue-500 mb-2 p-2 w-full rounded"
              id="title"
              name="title"
              onChange={(e) =>
                updateRecord({ ...editedRecord, title: e.target.value })
              }
              type="text"
              value={editedRecord.title || ''}
            ></input>
          </div>
          <div>
            <label className="block font-bold" htmlFor="genre">
              Genre:
            </label>
            <input
              className="border border-gray-300 focus:outline-none focus:border-blue-500 mb-2 p-2 rounded w-full"
              id="genre"
              name="genre"
              onChange={(e) =>
                updateRecord({ ...editedRecord, genre: e.target.value })
              }
              type="text"
              value={editedRecord.genre || ''}
            ></input>
          </div>
          <div>
            <label className="block font-bold" htmlFor="releaseYear">
              ReleaseYear:
            </label>
            <input
              className="border border-gray-300 focus:outline-none focus:border-blue-500 mb-10 p-2 rounded w-full"
              id="releaseYear"
              name="releaseYear"
              onChange={(e) =>
                updateRecord({
                  ...editedRecord,
                  release_year: Number(e.target.value),
                })
              }
              type="text"
              value={editedRecord.release_year || ''}
            ></input>
          </div>
          <button
            className=" py-2 px-4 rounded text-white bg-indigo-600"
            type="submit"
          >
            Update
          </button>
        </div>
      </form>
    </div>
  )
}
