import { useState, FormEvent } from 'react'
import { MusicalNoteIcon, ArrowPathIcon } from '@heroicons/react/24/solid'
import { useMutateAuth } from '../hooks/useMutateAuth'

export const Auth = () => {
  // State定義
  // useState()でフォーム入力の値を管理
  const [email, setEmail] = useState('')
  const [pw, setPw] = useState('')
  const [isLogin, setIsLogin] = useState(true)
  // 関数定義
  const { loginMutation, registerMutation } = useMutateAuth()

  const submitAuthHandler = async (e: FormEvent<HTMLFormElement>) => {
    // ブラウザのデフォルトの動作を防ぐ
    // ReactなどのフロントFwは、非同期操作やAPI呼出しを行うことが多いため、フォームの送信後にページのリロードを避ける必要がある
    e.preventDefault()
    // loginモードの場合
    if (isLogin) {
      // useMutationで登録した関数に引数を渡している
      // mutate: 非同期操作をトリガーするためのメソッドで、コールバックや状態の管理をライブラリに任せた実行方法
      loginMutation.mutate({
        email: email,
        password: pw,
      })
    } else {
      // signUp
      // mutateAsync: 非同期操作をトリガーするメソッドで、Promiseを返す。呼び出し元で非同期の完了を待つことができる
      // 非同期操作を順番に実行したい場合や、処理が終わるのを待ってから次の処理を行いたい場合には mutateAsync()とawaitを使う
      await registerMutation
        .mutateAsync({
          email: email,
          password: pw,
        })
        .then(() =>
          // signup成功時続けてloginを呼び出す
          loginMutation.mutate({
            email: email,
            password: pw,
          })
        )
    }
  }

  return (
    // ReactのJSX構文
    // JSX内の{}はJavaScript
    // Tailwind(CSS)のクラスユーティリティ設定　以降が実際の画面(components)
    /* flex: 指定した要素をflexコンテナにする、直下のブロック要素を操作できるようになる  */
    /* justify-center: 横方向の中央揃え */
    /* items-center: 縦方向の中央揃え */
    /* flex-col: 各itemを縦に積む */
    /* min-h-screen: TailwindCSSで提供されているユーティリティクラス
　　最小の高さ（minimum height）を画面の高さ（100vh）に設定
    ↑はようするにRecordListにしていすると100Vhの高さが保証される
    例えば、navbarを上に付けるとその高さ分、下にスクロールが生まれるということ
　　これにより、その要素は少なくとも画面全体の高さを持つ
　　つまり、コンテンツが少なくても、画面全体を埋めるようになる
　　例えば、画面全体を占める背景色をつける場合や、中央揃えのコンテンツを縦横中央に配置する場合に役立つ
　　コンテンツが画面より少ない場合も、画面いっぱいの高さを持たせることができるので、ページデザインを整える際に便利
　　例えば、中央にテキストやボタンを配置して、どんな画面サイズでも中央にきちんと表示されるようにしたい場合に使う */
    <div className="flex justify-center items-center flex-col min-h-screen text-gray-600 font-mono">
      {/*title*/}
      <div className="flex items-center">
        {/* h：height, w: width, mr: margin-right */}
        {/* h-8: 単位はremだが8remというわけではなく2rem、そうtailWidが決めてる、より直感的というてい */}
        {/* 500は、色のシェード（明暗の度合い）、通常100から900まであり小さいほど明るい、大きいほど暗い色、500は中間 */}
        <MusicalNoteIcon className="h-8 w-8 mr-2 text-blue-500" />
        {/* text-3xl: 文字サイズを30pxに設定、3xl=1.875rem (30px)、文字サイズのプリセット */}
        {/*	font-extrabold = font-weight: 800; */}
        <span className="text-center text-3xl font-extrabold">
          RecordShop by React/Go(Echo)
        </span>
      </div>
      {/*loginモードの内容によりタイトルの内容切替え*/}
      {/*　my: 上下のmargin(y軸) */}
      <h2 className="my-6">{isLogin ? 'Login' : 'Create a new account'}</h2>
      {/* ユーザーがemailとpwを入力するフォーム、サブミット時に↑のsubmitAuthHandlerを呼出す */}
      {/* submitAuthHandlerは↑で指定している関数だが、Reactのイベントハンドラは関数の参照を渡す */}
      {/* 関数参照： 関数を★実行せずに、関数そのものを渡すこと、ReactやJSのイベントハンドラは、関数参照を渡すのが一般的*/}
      {/* Reactが関数を適切なタイミング（この場合はフォームが送信される時）で実行できるようにするため */}
      {/* Reactがフォーム送信時に関数を呼出すタイミングで、イベント（e: FormEvent<HTMLFormElement>）を引数として渡す*/}
      <form onSubmit={submitAuthHandler}>
        <div>
          {/* value: Stateのemailが表示される */}
          {/* onChage(入力欄が変更される都度発生)⇒StateのsetEmailを経由してemailに保存される */}
          {/* 入力値がリアルタイム更新され、フォームが再レンダリングされ最新の emailが <input> に反映される */}
          {/* これを「双方向データバインディング」と呼ぶ */}
          {/* mb: margin-bottom, px: 左右のpadding(x軸) py: 上下のパディング(y軸) */}
          {/* text-sm: 文字サイズを14pxに設定, sm: 0.875rem (14px), 文字サイズのプリセット*/}
          <input
            className="mb-3 px-3 text-sm py-2 border border-gray-300"
            name="email"
            type="email"
            autoFocus
            placeholder="Email address"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </div>
        <div>
          <input
            className="mb-3 px-3 text-sm py-2 border border-gray-300"
            name="password"
            type="password"
            placeholder="Password"
            onChange={(e) => setPw(e.target.value)}
            value={pw}
          />
        </div>
        <div className="flex justify-center my-2">
          {/* disabled: emailとpwのどちらかが空ならボタンを無効化 */}
          {/* disabled: emailかpwどちらか空なら無効化 */}
          {/* disabled:opacity-40: ボタンが無効（disabled）の場合、透過度（opacity）を40%に設定 */}
          {/* rounded: 角を標準的な丸み（4px）で丸く */}
          {/* w-full: ボタンの幅を親要素と同じ幅に設定 
          通常ブロックレベルの要素（幅が親要素いっぱい）なので、
          親要素が制限されていなくても、両方が同じ幅を持つことがある */}
          <button
            className="disabled:opacity-40 py-2 px-4 rounded text-white bg-indigo-600 w-full"
            disabled={!email || !pw}
            type="submit"
          >
            {/* ボタン内の文字もStateで切替え */}
            {isLogin ? 'Login' : 'Sign Up'}{' '}
          </button>
        </div>
      </form>
      {/* loginモードとregister(signup)モードが切替えられるボタン(アイコン) */}
      {/* cursor-pointer: マウスカーソルが要素にホバー時、クリック可能なことを示すカーソル */}
      <ArrowPathIcon
        onClick={() => setIsLogin(!isLogin)}
        className="h-6 w-6 my-2 text-blue-500 cursor-pointer"
      />
    </div>
  )
}
