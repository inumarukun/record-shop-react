import { useState, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
// この中括弧は、名前付きエクスポートをインポートしている、オブジェクト分割代入から名前のものだけ取り出すのに必要
// もし、useMutateAuthが単一の値のみを返しているのであればimport、constでの｛｝は不要、例: axios
import { useQueryRecords } from '../hooks/useQueryRecords'
import { RecordItem } from './RecordItem'
import ModalDialog from './ModalDialog'
import { useMutateRecords } from '../hooks/useMutateRecords'
import { useLoading } from '../context/LoadingContext'
import { useAuth } from '../context/AuthContext'

export const RecordList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [title, setTitle] = useState<string>('')
  // <number | null> は、selectedRecordIdの型指定、number型か、null型のいずれか
  const [selectedRecordId, setSelectedRecordId] = useState<number | null>(null)

  const navigate = useNavigate()
  //コンポーネントが呼ばれるたびに(キャッシュが無ければ)ListをFetch
  debugger
  const { data, isLoading: isLoadingFromQuery } = useQueryRecords()
  const { deleteRecordMutation } = useMutateRecords()
  const { isLoading: isLoadingFromContext } = useLoading()
  const { username } = useAuth()

  const handleDeleteClick = (id: number, title: string) => {
    setSelectedRecordId(id)
    setTitle(title)
    setIsModalOpen(true) // モーダル表示State（ModalDialog.tsx参照）
  }

  const handleConfirmDelete = () => {
    if (isLoadingFromContext) return
    if (selectedRecordId !== null) {
      deleteRecordMutation.mutate(selectedRecordId) // 削除処理を実行
    }
    setIsModalOpen(false) // モーダルを閉じる
  }

  const handleCloseModal = () => {
    setIsModalOpen(false) // モーダルを閉じる
  }

  const submitRecordHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    navigate('/createItem')
    // if (editedRecord.id === 0) {
    //   // zustandが0の場合は新規作成
    //   createRecordMutation.mutate({
    //     title: editedRecord.title,
    //     artist: editedRecord.artist,
    //     genre: editedRecord.genre,
    //     style: editedRecord.style,
    //     release_year: editedRecord.release_year,
    //   })
    // } else {
    //   updateRecordMutation.mutate(editedRecord)
    // }
  }
  return (
    // jsx
    <div className="px-5 text-gray-600 font-mono mt-2">
      {/* Userが入力するためのForm、submitボタン押下時submitTaskHandlerが呼び出される↑ */}
      <form onSubmit={submitRecordHandler}>
        {/* add button */}
        {username ? (
          <button
            className="disabled:opacity-40 py-2 px-3 text-white bg-indigo-600 rounded"
            //disabled={!editedRecord.title}
          >
            Add Record
            {/* {editedRecord.id === 0 ? 'Create' : 'Update'} */}
          </button>
        ) : null}
      </form>
      {/* recordの一覧表示
        useQueryRecordsのisLoading Stateがtrueの場合、Loading...を表示
        isLoadingやisErrorといったプロパティは、useQueryの戻り値に含まれる状態を表すものであり、
        クエリが返すデータやエラーそのものの型とは異なる
        これらはクエリの実行状態（ロード中、成功、失敗など）を管理するためのプロパティ
        UseQueryResult 型は、データとエラーの型に関わらず、常にこれらのプロパティを持っている
        だからuseQueryの戻り値型指定には出てこない, return useQuery<Record[], Error>({
        StateがfalseでLoading終了＝fetch終了と判断して取得したデータをmapで展開、RecordItemコンポーネントを表示 */}
      {isLoadingFromQuery ? (
        <p>Loading...</p>
      ) : (
        // React(JSX)ではclassではなく、className
        <table className="my-5 w-full table-fixed border-collapse">
          <thead className="font-bold text-left">
            <tr>
              <th>Artist</th>
              <th>Title</th>
              <th>Genre</th>
              <th>Style</th>
              <th>Release Year</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {/* ?. オプショナルチェイニング- nullまたはundefinedの場合にエラーを投げずに処理を中断するJS構文 */}
            {/* dataが存在する場合にのみ mapメソッドを実行し、存在しない場合は undefinedを返しエラーを防ぐ */}
            {data?.map((record) => (
              <RecordItem
                key={record.id}
                // 呼び先のRecordItemMemoPropsではrecordプロパティで渡している、バラバラは駄目
                record={record}
                // id={record.id}
                // title={record.title}
                // artist={record.artist}
                // genre={record.genre}
                // style={record.style}
                // release_year={record.release_year}
                onDeleteClick={handleDeleteClick} // 削除処理を実施する関数を渡す
              />
            ))}
          </tbody>
        </table>
      )}
      {/* モーダルを表示 */}
      <ModalDialog
        isOpen={isModalOpen}
        title={title}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
      />
    </div>
  )
}
