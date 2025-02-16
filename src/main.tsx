import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

// react-queryのQueryClient作成
const queryClient = new QueryClient({})

// create-react-app で作成される index.tsと同じ役割
// Reactアプリのエントリーポイントとして動作し、アプリをHTMLにマウントする
// .tsx: .jsxを含むtypescript
// .jsx: .js拡張構文、ReactでUI要素を記述するために使用
// （UIコンポーネントのファイルか、ロジックを書くファイルか）で.tsxと.tsは分けるべき
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* アプリ全体にreact-queryを適用するためAppコンポーネントを囲む */}
    <QueryClientProvider client={queryClient}>
      <App />
      {/* react-query-devtools有効化 */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>
)
