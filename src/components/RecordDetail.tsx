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
    axios
      .get<Detail>(
        `${import.meta.env.VITE_REACT_APP_API_URL}/records/${title}`,
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        setRecordDetail(response.data)
      })
      .catch((error) => {
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
    <div className="flex px-5">
      <div>
        <ArrowUturnLeftIcon
          onClick={back}
          className="h-6 w-6 my-3 text-blue-500 cursor-pointer"
        />
        <h2>{recordDetail.recordTitle}</h2>
        <div className="mb-4">
          <img
            src={`http://localhost:8080/${recordDetail.albumImageUrl}`}
            alt={recordDetail.recordTitle}
            style={{ maxWidth: '100%' }}
          />
        </div>
        <ul>
          {recordDetail.tracks.map((track, index) => (
            <li key={index}>
              {track.trackNumber}: {track.trackTitle}
            </li>
          ))}
        </ul>
      </div>
      <div className="w-full aspect-w-16 aspect-h-9 ml-32 mt-18">
        <iframe
          width="50%"
          height="50%"
          src={`https://www.youtube.com/embed/${recordDetail.youtubeVideoId}`}
          title={recordDetail.youtubeTitle}
          frameBorder="1"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  )
}
