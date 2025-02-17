import { FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import {
  ArrowRightEndOnRectangleIcon,
  ArrowUturnLeftIcon,
  MusicalNoteIcon,
} from '@heroicons/react/24/solid'
import { useMutateRecords } from '../hooks/useMutateRecords'
import { useMutateAuth } from '../hooks/useMutateAuth'
import { useLoading } from './LoadingContext'

export const CreateItem = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  // Stateも渡すことが出来る
  const { createRecordMutation } = useMutateRecords()
  const { logoutMutation } = useMutateAuth()
  // これは自分がカスタムしたuseStoreとは違う
  const [artist, setArtist] = useState('')
  const [title, setTitle] = useState('')
  const [genre, setGenre] = useState('')
  const [releaseYear, setReleaseYear] = useState('')
  const { isLoading } = useLoading()

  const submitRecordHandler = (e: FormEvent<HTMLFormElement>) => {
    if (isLoading) return
    e.preventDefault()
    createRecordMutation.mutate({
      artist: artist,
      title: title,
      genre: genre,
      release_year: Number(releaseYear),
    })
  }

  const logout = async () => {
    await logoutMutation.mutateAsync()
    queryClient.removeQueries(['records'])
  }

  const back = () => {
    // navigate('/recordList')
    navigate(-1)
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
          {/* forでエラーになるのはReactがJSの中で動作するためJSのforとの名前衝突は図るため */}
          {/* class ⇒ className、　style ⇒ style={{。。。}}も同様の理由*/}
          <label className="block font-bold" htmlFor="artist">
            Artist:
          </label>
          <input
            className="autofocus border border-gray-300 focus:outline-none focus:border-blue-500  mb-2 p-2 rounded w-full"
            id="artist"
            name="artist"
            onChange={(e) => setArtist(e.target.value)}
            placeholder="artist"
            type="text"
            value={artist}
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
            onChange={(e) => setTitle(e.target.value)}
            placeholder="title"
            type="text"
            value={title}
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
            onChange={(e) => setGenre(e.target.value)}
            placeholder="genre"
            type="text"
            value={genre}
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
            onChange={(e) => setReleaseYear(e.target.value)}
            placeholder="release year"
            type="text"
            value={releaseYear}
          ></input>
        </div>
        <div>
          <button
            className=" py-2 px-4 rounded text-white bg-indigo-600"
            type="submit"
          >
            Add
          </button>
        </div>
      </form>
    </div>
  )
}
