import { FC, memo } from 'react'
import { useNavigate } from 'react-router-dom'
import { PencilIcon, TrashIcon } from '@heroicons/react/24/solid'
import useStore from '../store'
import { Record } from '../types'
import { useMutateRecords } from '../hooks/useMutateRecords'

// 親component(Todo.tsx)のStateの変化による再レンダリングを防ぐためにMemo化を行っている（一番下memo(RecordItemMemo)）
// Memo化というのはキャッシュみたいなもんか？↓のプロパティの変更が無い限り再レンダリングはされない
// componemtのpropsの型として、Task型からcreated_at, updted_atをのぞいたid, titleを受取る
const RecordItemMemo: FC<Omit<Record, 'created_at' | 'updated_at'>> = ({
  // props
  id,
  title,
  artist,
  genre,
  release_year,
}) => {
  const navigate = useNavigate()
  const updateRecord = useStore((state) => state.updateEditedRecord)
  const { deleteRecordMutation } = useMutateRecords()
  // jsx
  // jsxは親エレメントは1つでなければいけない
  return (
    <tr>
      <td>{artist}</td>
      <td>{title}</td>
      <td>{genre}</td>
      <td>{release_year}</td>
      <td>
        {/* PencilIconクリック時、zustandから読み込んだupdateTask呼出し↑（propsで受け取っていたidとtitleを引数で渡す） */}
        <PencilIcon
          className="h-5 w-5 mx-1 text-blue-500 cursor-pointer"
          onClick={() => {
            updateRecord({
              id: id,
              title: title,
              artist: artist,
              genre: genre,
              release_year: release_year,
            })
            navigate('/updateItem')
          }}
        />
      </td>
      <td>
        {/* TrashIconクリック時、useMutateTaskカスタムフックからdeleteRecordMutation呼出し↑ */}
        <TrashIcon
          className="h-5 w-5 text-blue-500 cursor-pointer"
          onClick={() => {
            deleteRecordMutation.mutate(id)
          }}
        />
      </td>
    </tr>
  )
}
export const RecordItem = memo(RecordItemMemo)
