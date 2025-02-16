// エラーメッセージをハンドリングするカスタムフック
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { CsrfToken } from '../types'
import useRecord from '../store'

// Functional Component
export const useError = () => {
  const navigate = useNavigate()
  //zustandから関数読み込んでコンポーネントで使用できるようにする
  //(state)の記述に物凄く混乱するが引数で渡しているわけではない
  // useRecordフックからresetEditedRecord関数を取得しているだけで
  // ★気にしないでよい、stateではなくaaaでもbbbでもいい
  // フックが返すオブジェクトを参照しているだけ
  // 「状態オブジェクトを内部で提供し、その状態オブジェクトを引数として関数を渡すという形」

  // useRecord((state) => state.resetEditedRecord)
  // 引数部分でState(useRecordの戻り値)を使える仕組みをzustand等の状態管理ライブラリは用意している
  // （見た目かなり違和感を感じる）
  // それを使って特定の関数を呼び出し元で使えるようにする。
  // 例：
  // const resetEditedRecord = useRecord((state) => state.resetEditedRecord)
  // と呼べば以降の処理でいくらでもresetEditedRecordを使える。
  // （クロージャ的に扱えるように見えるが、実際は状態オブジェクトを引数として渡している）
  const resetEditedRecord = useRecord((state) => state.resetEditedRecord)

  const getCsrfToken = async () => {
    const { data } = await axios.get<CsrfToken>(
      `${import.meta.env.VITE_REACT_APP_API_URL}/csrf`
    )
    axios.defaults.headers.common['X-CSRF-Token'] = data.csrf_token
  }

  const switchErrorHandling = (msg: string) => {
    switch (msg) {
      case 'invalid csrf token':
        getCsrfToken()
        alert('CSRF token is invalid, please try again')
        break
      case 'invalid or expired jwt':
        alert('access token expired, please login')
        resetEditedRecord() // Stateリセット
        navigate('/') // indexページへ
        break
      case 'missing or malformed jwt':
        alert('access token is not valid, please login')
        resetEditedRecord()
        navigate('/')
        break
      case 'duplicated key not allowed':
        alert('email already exist, please use another one')
        break
      case 'crypto/bcrypt: hashedPassword is not the hash of the given password':
        alert('password is not correct')
        break
      case 'record not found':
        alert('email is not correct')
        break
      default:
        alert(msg)
    }
  }

  return { switchErrorHandling } // カスタムフックの戻り値として↑の関数を返すようにしておく
}
