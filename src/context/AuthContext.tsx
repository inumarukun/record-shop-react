import { createContext, useState, useContext, ReactNode } from 'react'

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
  const [username, setUsername] = useState<string | null>(null)

  return (
    <AuthContext.Provider value={{ username, setUsername }}>
      {children}
    </AuthContext.Provider>
  )
}
