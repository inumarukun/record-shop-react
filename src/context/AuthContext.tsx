import {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from 'react'

interface AuthContextType {
  username: string | null
  setUsername: (username: string) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// このHookを使うことで、コンポーネントから username を取得
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  // localStorageからusernameを復元
  const savedUsername = localStorage.getItem('username')
  const [username, setUsername] = useState<string | null>(savedUsername)

  // usernameが更新された時にlocalStorageにも保存
  useEffect(() => {
    if (username) {
      localStorage.setItem('username', username)
    } else {
      localStorage.removeItem('username')
    }
  }, [username])

  return (
    <AuthContext.Provider value={{ username, setUsername }}>
      {children}
    </AuthContext.Provider>
  )
}
