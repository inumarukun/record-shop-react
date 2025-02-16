import { create } from 'zustand' // zustand: 軽量なグローバル状態管理ライブラリ

// Stateで使う型定義
type EditedRecord = {
  id: number
  title: string
  artist: string
  genre: string
  release_year: number
}

type State = {
  editedRecord: EditedRecord // 状態管理したいState名: Stateの型
  updateEditedRecord: (payload: EditedRecord) => void // Stateに関連する関数定義、引数（引数名: 型）=> 戻り値
  resetEditedRecord: () => void
}

// zustandパッケージのcreateを使ってStateと関数の具体的な処理を記述
// create: zustandのメソッド状態管理のストアを作成
// (set)は関数を渡していいて、set({...で使われている)、つまり仮引数はzustandのcreate配下のgetかset
// アロー演算子が呼んでいる{}を()で囲んでいるがこれは{}全体をuseRecordに返しているということ
// {}だけだと関数ブロックと思われuseRecordに返すものが無くエラーになる
// で渡したset(get)関数がuserecordで戻された先でも動作するクロージャの例になっている
const useRecord = create<State>((set) => ({
  // Stateの初期値設定
  editedRecord: { id: 0, title: '', artist: '', genre: '', release_year: 0 },

  updateEditedRecord: (payload) =>
    // set: createメソッドに備わっている関数、storeの状態を更新する
    set({
      // ↑の関数の実装
      editedRecord: payload,
    }),
  resetEditedRecord: () =>
    set({
      editedRecord: {
        id: 0,
        title: '',
        artist: '',
        genre: '',
        release_year: 0,
      },
    }),
}))

export default useRecord // useStoreをexport(別ファイルで使えるようにする)
