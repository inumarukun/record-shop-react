import { useEffect } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Auth } from './components/Auth'
import { RecordList } from './components/RecordList'
import axios from 'axios'
import { CsrfToken } from './types'
import { CreateItem } from './components/CreateItem'
import { UpdateItem } from './components/UpdateItem'

// Appコンポーネントはアプリが起動した時に実行される
function App() {
  // useEffect - React Hookの1つ
  // コンポーネントがレンダリングされるタイミングでサイドエフェクトを実行するために使用
  // コンポーネントのライフサイクルに合わせてサイドエフェクトを実行するために使用
  // 第1引数：サイドエフェクトを実行する関数
  // 第2引数：依存配列、この配列が変更された時にuseEffect内の処理が再実行される
  // 依存配列が空の場合、useEffectはコンポーネントが初めてレンダリングされた時に1度だけ実行される
  useEffect(() => {
    // axios: ブラウザやNode.jsで動くPromiseベースのHTTPクライアント、 HTTPリクエストを簡単に行える
    // withCredentials: クロスオリジンのリクエストでクッキーや認証情報を送信するために設定
    // true に設定すると、クロスドメインのリクエストでもクッキーを送信
    axios.defaults.withCredentials = true
    // axiosを使ってCSRFトークンをサーバーから取得
    const getCsrfToken = async () => {
      debugger
      // get: サーバーにHTTP GETリクエスト、レスポンスとしてCsrfトークン取得
      //<CsrfTokem>部分はTypeScriptのジェネリクス、ここではaxios.getが返すデータ型を指定している
      // index.tsで定義した型定義
      // ジェネリクスを使うことで、axios のレスポンスの型を TypeScriptに正確に伝えることができ、型安全を確保
      const { data } = await axios.get<CsrfToken>(
        // process.envで(通常.env)環境変数にアクセス
        // Vite環境ではprocess.envではなく、import.meta.env
        `${import.meta.env.VITE_REACT_APP_API_URL}/csrf`
      )
      // 取得したcsrfTokenをheaderに設定
      // 今後のaxiosによるリクエストでこのtokenを使う
      axios.defaults.headers.common['X-CSRF-Token'] = data.csrf_token
    }
    // ここで呼んでる
    getCsrfToken()
  }, [])
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/recordList" element={<RecordList />} />
        <Route path="/createItem" element={<CreateItem />} />
        <Route path="/updateItem" element={<UpdateItem />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
