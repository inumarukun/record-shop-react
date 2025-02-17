import { FC, memo } from 'react'
import { useNavigate } from 'react-router-dom'
import { PencilIcon, TrashIcon } from '@heroicons/react/24/solid'
import useStore from '../store'
import { Record } from '../types'

// Record型から 'created_at' と 'updated_at' を省略
// onDeleteClickを追加するため新しいtypeを作成した
type RecordItemMemoProps = {
  record: Omit<Record, 'created_at' | 'updated_at'> // recordオブジェクトとして渡す
  onDeleteClick: (id: number) => void // 削除ボタン押下時の関数
}

// FCは、Functional Componentの略で、Reactで関数型コンポーネントを型指定するための型エイリアス
// 下記は、RecordItemMemoコンポーネントが関数型コンポーネントであり、
// そのpropsとして、RecordItemMemoProps型を受け取ることを示す
// FCを使うことで、コンポーネントのprops型や戻り値が明確に指定され、以下のメリット
// 型安全性の向上
// childrenプロパティが自動的に型推論される
// コンポーネントの定義が簡潔
const RecordItemMemo: FC<RecordItemMemoProps> = ({ record, onDeleteClick }) => {
  // recordオブジェクトの各プロパティを分解代入する
  const { id, title, artist, genre, release_year } = record
  // props
  // id,
  // title,
  // artist,
  // genre,
  // release_year,
  // }) => {
  const navigate = useNavigate()
  const updateRecord = useStore((state) => state.updateEditedRecord)
  // jsx
  // jsxは親エレメントは1つでなければいけない
  return (
    <tr>
      <td>{artist}</td>
      <td>{title}</td>
      <td>{genre}</td>
      <td>{release_year}</td>
      <td>
        {/* PencilIcon押下時、zustand(useStore)から読み込んだupdateTask呼出し↑（propsで受け取っていたidとtitleを引数で渡す） */}
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
        {/* TrashIcon押下時、useMutateTaskカスタムフックからdeleteRecordMutation呼出し↑ */}
        {/* イベント発生時に onDeleteClick(id)を実行する遅延実行にするためアロー関数 */}
        {/* もしアロー関数で囲んでないとクリック時ではなくレンダリング時に実行する↑もだが */}
        {/* クリック時に関数を実行するのではなく、関数の結果を参照すしてまうイメージ */}
        {/* 関数の参照に()をつければそれは実行するということ */}
        <TrashIcon
          className="h-5 w-5 text-blue-500 cursor-pointer"
          onClick={() => {
            // deleteRecordMutation.mutate(id)
            onDeleteClick(id)
          }}
        />
      </td>
    </tr>
  )
}
// 親component(RecordList.tsx)のStateの変化による再レンダリングを防ぐためにMemo化を行っている
// React.memoは、propsが変更されない限り コンポーネントを再レンダリングしないようにする関数
// RecordItemMemoコンポーネントをReact.memoでラップすると、RecordItemMemoコンポーネントが
// 再レンダリングされるのは、その propsが前回と異なる場合だけになる
// これにより、無駄なレンダリングを防ぎ、パフォーマンス向上が期待できる
export const RecordItem = memo(RecordItemMemo)
