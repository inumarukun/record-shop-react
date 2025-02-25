import { useState, useEffect } from 'react'
import axios from 'axios'
import { Detail } from '../types'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowUturnLeftIcon } from '@heroicons/react/24/solid'

export const RecordDetail: React.FC = () => {
  // useParams: URLパラメータからIDを取得
  const { title } = useParams<{ title: string }>()
  const [recordDetail, setRecordDetail] = useState<Detail | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    debugger
    axios
      .get<Detail>(
        `${import.meta.env.VITE_REACT_APP_API_URL}/records/${title}`,
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        debugger
        setRecordDetail(response.data)
      })
      .catch((error) => {
        debugger
        console.error('There was an error fetching the record detail!', error)
      })
  }, [title])

  if (!recordDetail) {
    return <div>Loading...</div>
  }

  const back = () => {
    // navigate('/recordList')
    navigate(-1)
  }

  return (
    <div className="px-5">
      <ArrowUturnLeftIcon
        onClick={back}
        className="h-6 w-6 my-3 text-blue-500 cursor-pointer"
      />
      <h2>{recordDetail.title}</h2>
      <img src={recordDetail.album_image_url} alt="Album Image" />
      <ul>
        {recordDetail.tracks.map((track, index) => (
          <li key={index}>
            {track.trackNumber}: {track.trackTitle}
          </li>
        ))}
      </ul>
    </div>
  )
}
