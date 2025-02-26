import axios from 'axios'
import { useQueryClient, useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { Record } from '../types'
import useRecord from '../store'
import { useError } from './useError'
import { useLoading } from '../context/LoadingContext'

// カスタムフックは複数のコンポーネントの中に存在する共通の処理を取り出して作成した関数
export const useMutateRecords = () => {
  // 関数読込
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { switchErrorHandling } = useError()
  const resetEditedRecord = useRecord((state) => state.resetEditedRecord)
  const { setIsLoading } = useLoading()

  // jsの関数は呼出される前に定義してないと駄目
  // const で定義された関数や変数は「ホイスティング（巻上げ）」されないため、
  // 宣言する前にその関数を呼び出すと、エラーが発生
  const sortRecords = (records: Record[]): Record[] => {
    return records.sort((a, b) => {
      // release_yearで昇順に比較
      if (a.release_year !== b.release_year) {
        return a.release_year - b.release_year
      }
      // release_yearが同じ場合、artistで昇順に比較
      if (a.artist !== b.artist) {
        // 文字列は、localeCompareを使用
        return a.artist.localeCompare(b.artist)
      }
      // release_yearとartistが同じ場合、titleで昇順に比較
      return a.title.localeCompare(b.title)
    })
  }

  // record新規作成　react-queryのuseMutation使用
  // これも関数呼出し、で引数に関数(useMutation が実行する 非同期操作)を渡している
  // で、これを呼ぶ元で.mutate等を使える仕組みを返している
  const createRecordMutation = useMutation(
    // 引数として、'id', 'created_at', 'updated_at'を取り除いたRecord型を指定
    // 引数名: 型
    (record: Omit<Record, 'id' | 'created_at' | 'updated_at'>) =>
      axios.post<Record>(
        `${import.meta.env.VITE_REACT_APP_API_URL}/records`,
        record
      ),
    {
      onMutate: () => {
        setIsLoading(true)
      },
      // mutationFn の戻り値に基づいて自動的に型推論
      onSuccess: (res) => {
        setIsLoading(false)
        // 成功したらキャッシュ中のRecord一覧取得、cache: 'records'は
        // useQueryRecords.tsのuseQueryで定義
        // useQueryは、react-queryの機能で、useQueryTasks.tsではプロパティを定義しているだけ
        const previousRecords = queryClient.getQueryData<Record[]>(['records'])
        debugger
        // 既存のcache: 'records'が存在した場合、その末尾に新しく生成したrecordsを追加
        if (previousRecords) {
          const updatedRecords = [...previousRecords, res.data]
          // これは関数名に()がついているので関数をこの場で呼んでいる、定義ではない
          // なぜそんなことを言っているか⇒useQueryRecords.ts　12Lあたり
          // const sortedRecords = updatedRecords.sort((a, b) => {
          //   // release_yearで昇順に比較
          //   if (a.release_year !== b.release_year) {
          //     return a.release_year - b.release_year
          //   }
          //   // release_yearが同じ場合、artistで昇順に比較
          //   if (a.artist !== b.artist) {
          //     // 文字列は、localeCompareを使用
          //     return a.artist.localeCompare(b.artist)
          //   }
          //   // release_yearとartistが同じ場合、titleで昇順に比較
          //   return a.title.localeCompare(b.title)
          // })
          const sortedRecords = sortRecords(updatedRecords)
          queryClient.setQueryData(['records'], sortedRecords)
          // queryClient.setQueryData(['records'], [...previousRecords, res.data])
          // ちなみに追加ではなく新しく置き換えたい場合は以下
          // queryClient.setQueryData(['records'], res.data)
        }
        navigate('/recordList')
      },
      // エラーオブジェクトがどのような形を取るかが不確定なため、型をanyに指定
      onError: (err: any) => {
        setIsLoading(false)
        if (err.response.data.message) {
          // validateエラーはこっち
          switchErrorHandling(err.response.data.message)
        } else {
          switchErrorHandling(err.response.data)
        }
      },
    }
  )
  // record更新 react-queryのuseMutation使用
  const updateRecordMutation = useMutation(
    (record: Omit<Record, 'created_at' | 'updated_at'>) =>
      axios.put<Record>(
        `${import.meta.env.VITE_REACT_APP_API_URL}/records/${record.id}`,
        {
          id: record.id,
          artist: record.artist,
          title: record.title,
          genre: record.genre,
          style: record.style,
          release_year: record.release_year,
        }
      ),
    {
      onMutate: () => {
        setIsLoading(true)
      },
      // putの場合は、レスポンスデータと、 (更新対象として)送信したデータの2つ引数が必要
      onSuccess: (res, variables) => {
        debugger
        setIsLoading(false)
        const previousRecords = queryClient.getQueryData<Record[]>(['records'])
        // 既存のキャッシュが存在する場合
        if (previousRecords) {
          // キャッシュをmapで展開して(record)、idが一致する要素を更新後の要素(res.data)で更新する
          const updatedRecords = previousRecords.map((record) =>
            record.id === variables.id ? res.data : record
          )
          const sortedRecords = sortRecords(updatedRecords)
          queryClient.setQueryData<Record[]>(['records'], sortedRecords)
        }
        resetEditedRecord()
        navigate('/recordList')
      },
      onError: (err: any) => {
        debugger
        setIsLoading(false)
        if (err.response.data.message) {
          switchErrorHandling(err.response.data.message)
        } else {
          switchErrorHandling(err.response.data)
        }
      },
    }
  )
  // record削除 react-queryのuseMutation使用
  const deleteRecordMutation = useMutation(
    // 引数として削除したいidを受け取る
    (id: number) =>
      axios.delete(`${import.meta.env.VITE_REACT_APP_API_URL}/records/${id}`),
    {
      // 通常_の部分はresponseが返る、variablesはdelete呼出し時に渡されたidが渡される
      onSuccess: (_, variables) => {
        setIsLoading(false)
        // キャッシュされた records のリストを取得
        // キャッシュ：recordsは、useQueryRecords.tsのuseQueryで定義
        const previousRecords = queryClient.getQueryData<Record[]>(['records'])
        if (previousRecords) {
          queryClient.setQueryData<Record[]>(
            ['records'],
            // 既存のキャッシュにfilterをかけ、今削除したオブジェクトだけをキャッシュから取り除く
            // この処理で一覧画面から削除した項目がサーバーから取得し直してるわけではないのに消えてる
            previousRecords.filter((record) => record.id !== variables)
          )
        }
        resetEditedRecord()
      },
      onError: (err: any) => {
        setIsLoading(false)
        if (err.response.data.message) {
          switchErrorHandling(err.response.data.message)
        } else {
          switchErrorHandling(err.response.data)
        }
      },
    }
  )
  return {
    createRecordMutation,
    updateRecordMutation,
    deleteRecordMutation,
  }
}
