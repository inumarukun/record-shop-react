import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import useRecord from '../store'
import { Credential } from '../types'
import { useError } from '../hooks/useError'
import { useAuth } from '../context/AuthContext'

export const useMutateAuth = () => {
  const navigate = useNavigate()
  const resetEditedRecord = useRecord((state) => state.resetEditedRecord)
  const { switchErrorHandling } = useError()
  const { setUsername } = useAuth()

  // react-queryによるuseMutation
  // useMutation: APIリクエストの状態を管理するための便利なフックで、成功やエラー時の処理も簡単に設定できる
  // まずuseMutation()に引数で関数を渡す。（↓がそう）
  // その関数をuseMutation()の戻り値UseMutationResultにあるmutate()で引数を渡して呼ぶことが出来る(Auth.tsx参照)
  // zustandとまた使い方が違いが、各ライブラリが利便性を追求した結果であり、これらはJSやREACTの知識ではない
  const loginMutation = useMutation(
    // 奇怪な書き方だがこれがuseMutationの書き方
    // 第1引数: ミューテーションを実行する関数（APIリクエストなど）
    // 第2引数: オプションオブジェクトで、成功時やエラー時に実行する処理（onSuccess, onError など）を指定
    // Credential型のuser情報(email, pw)を/loginにpost
    // 引数名: 型
    async (user: Credential) =>
      await axios.post(`${import.meta.env.VITE_REACT_APP_API_URL}/login`, user),
    {
      onSuccess: (data) => {
        // echo.ContextのJSONがデータをdataにラッピングしてるのでこうなる
        setUsername(data.data.email)
        // axios.get等と違ってサーバーに遷移するわけではない
        // 直接REACTの画面に遷移、定義はApp.tsx参照
        navigate('/recordList')
      },
      onError: (err: any) => {
        if (err.response.data.message) {
          // csrf middleware関係はコッチ
          switchErrorHandling(err.response.data.message)
        } else {
          switchErrorHandling(err.response.data)
        }
      },
    }
  )
  // siginup
  const registerMutation = useMutation(
    async (user: Credential) =>
      await axios.post(
        `${import.meta.env.VITE_REACT_APP_API_URL}/signup`,
        user
      ),
    {
      onError: (err: any) => {
        if (err.response.data.message) {
          switchErrorHandling(err.response.data.message)
        } else {
          switchErrorHandling(err.response.data)
        }
      },
    }
  )
  // logout
  const logoutMutation = useMutation(
    async () =>
      await axios.post(`${import.meta.env.VITE_REACT_APP_API_URL}/logout`),
    {
      onSuccess: () => {
        setUsername('')
        resetEditedRecord()
        navigate('/')
      },
      onError: (err: any) => {
        if (err.response.data.message) {
          switchErrorHandling(err.response.data.message)
        } else {
          switchErrorHandling(err.response.data)
        }
      },
    }
  )
  return { loginMutation, registerMutation, logoutMutation }
}
