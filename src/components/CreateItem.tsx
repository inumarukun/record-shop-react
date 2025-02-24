import { FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowUturnLeftIcon } from '@heroicons/react/24/solid'
import { useMutateRecords } from '../hooks/useMutateRecords'
import { useLoading } from '../context/LoadingContext'

export const CreateItem = () => {
  const navigate = useNavigate()
  const { createRecordMutation } = useMutateRecords()
  const [artist, setArtist] = useState('')
  const [title, setTitle] = useState('')
  const [genre, setGenre] = useState('')
  const [style, setStyle] = useState('')
  const [releaseYear, setReleaseYear] = useState('')
  const { isLoading } = useLoading()

  const submitRecordHandler = (e: FormEvent<HTMLFormElement>) => {
    if (isLoading) return
    e.preventDefault()
    createRecordMutation.mutate({
      artist: artist,
      title: title,
      genre: genre,
      style: style,
      release_year: Number(releaseYear),
    })
  }

  const back = () => {
    // navigate('/recordList')
    navigate(-1)
  }

  return (
    <div className="px-5 text-gray-600 font-mono mt-2">
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
          <label className="block font-bold" htmlFor="style">
            Style:
          </label>
          <input
            className="border border-gray-300 focus:outline-none focus:border-blue-500 mb-2 p-2 rounded w-full"
            id="style"
            name="style"
            onChange={(e) => setStyle(e.target.value)}
            placeholder="style"
            type="text"
            value={style}
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
