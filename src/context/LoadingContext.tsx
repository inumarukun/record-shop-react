import { createContext, useContext, useState } from 'react'

// コンテキストで使用する型を定義
type LoadingContextType = {
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
}

// Reactのコンテキストを作成するための関数
// undefinedgがデフォルト値として渡され、useContextを使ってコンテキストを取得した際に、
// コンテキストが存在しない場合にundefinedが返される
const LoadingContext = createContext<LoadingContextType | undefined>(undefined)

// isLoadingとsetIsLoadingを提供するプロバイダーコンポーネント
// 分割代入（Destructuring）を使って引数を取り出している典型的パターン
// childrenプロパティを含むオブジェクトを受け取った後、その中のchildrenを直接取り出すための構文
// { children, } は オブジェクトの分割代入で、propsオブジェクトからchildrenプロパティを直接取得
// LoadingProviderコンポーネントの引数が { children: React.ReactNode }だと示す
// 代入先はchildren, （ここで props オブジェクトから children プロパティの値が代入される
export const LoadingProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [isLoading, setIsLoading] = useState(false)

  return (
    // 子コンポーネントがこのコンテキストにアクセスできるようにする(value)
    // LoadingContext.Providerの子孫コンポーネントは、isLoadingやsetIsLoadingを利用できる
    // childrenは、LoadingProviderの中でisLoadingやsetIsLoadingを利用したいコンポーネント群
    // {children} によって、その中のコンポーネントが提供される
    <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
      {children}
    </LoadingContext.Provider>
  )
}

// コンテキストにアクセスするためのカスタムフック
// コンポーネント内で簡単にLoadingContext の状態（isLoading や setIsLoading）にアクセス
export const useLoading = () => {
  // useContextを使ってisLoadingとsetIsLoadingを取得
  const context = useContext(LoadingContext)
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider')
  }
  // コンテキストの値を返す（{ isLoading, setIsLoading }）
  return context
}
