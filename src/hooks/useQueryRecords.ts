import axios from 'axios'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Record } from '../types'
// まずexportしているexportを取得
import { useError } from './useError'

// カスタムフックは複数のコンポーネントの中に存在する共通の処理を取り出して作成した関数
export const useQueryRecords = () => {
  const queryClient = useQueryClient()
  // importしたuseErrorからreturnしている関数を選ぶ
  const { switchErrorHandling } = useError()
  // 以下の場合関数名は、処理自体が無名関数で、その関数を設定しているgetRecordsが関数名
  // getRecordsに()が付いていないのでこれは呼出しではなく定義
  // 実際の呼出し部分は↓のqueryFn: getRecords（を基にしたuseQueryの中）
  const getRecords = async () => {
    const { data } = await axios.get<Record[]>(
      `${import.meta.env.VITE_REACT_APP_API_URL}/records`,
      { withCredentials: true }
    )
    return data
  }
  // パッと見ややこしいが↑は定義、ここでの処理部はこのreturnのみ
  // useQuery(@tanstack/react-query)を実行した結果をreturn
  return useQuery<Record[], Error>({
    // ★react-queryでは、fetchしたデータをclientのキャッシュに格納してくれる
    // キャッシュのkeyとして'records'を定義している
    queryKey: ['records'],
    queryFn: getRecords, // ↑の関数
    // キャッシュしたデータをどのくらいの期間最新のものと見做すか？
    // 今回はManualでキャッシュを更新していくのでInfinity(無限大)を設定
    staleTime: Infinity,
    // コールバックの1つ、react-queryのmutationやqueryの非同期処理が成功時実行
    // dataはサーバーから返される新しいデータ
    onSuccess: (data) => {
      // キャッシュに既存のデータがある場合、重複しないように統合
      // キャッシュに保存されているクエリキー['record']に対応するデータを取得
      // もしデータが存在しない場合(undefined)は、以降の処理の安全のため空の配列[]を返している
      const previousRecords =
        queryClient.getQueryData<Record[]>(['records']) || []
      // 既存のレコードと新しいレコードを重複しないように統合
      const mergedRecords = [
        // 新しいレコードとIDが重複しないものを残す
        // some: 配列が条件を1つでも満たしていればtrue
        // record: previosRecords
        // newRecord: data
        ...previousRecords.filter(
          (record) => !data.some((newRecord) => newRecord.id === record.id)
        ),
        // 新しく取得したレコードをそのまま追加
        ...data,
      ]
      // 統合されたデータをキャッシュに保存
      queryClient.setQueryData(['records'], mergedRecords)
    },
    onError: (err: any) => {
      if (err.response.data.message) {
        switchErrorHandling(err.response.data.message)
      } else {
        switchErrorHandling(err.response.data)
      }
    },
  })
}
