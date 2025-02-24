import { useNavigate } from 'react-router-dom' // react-router-domを使用してリンクを作成
import { useQueryClient } from '@tanstack/react-query'
import {
  ArrowRightStartOnRectangleIcon,
  ArrowRightEndOnRectangleIcon,
  MusicalNoteIcon,
} from '@heroicons/react/24/solid'
import { useAuth } from '../context/AuthContext'
import { useMutateAuth } from '../hooks/useMutateAuth'

const Navbar = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { logoutMutation } = useMutateAuth()
  const { username } = useAuth()
  const login = async () => {
    navigate('/login')
  }
  const logout = async () => {
    // logoutが完了するまで、次の処理にいかずに待つ
    // (logout以外の非同期処理/イベントループは通常通り実施されている)
    await logoutMutation.mutateAsync()
    queryClient.removeQueries(['records'])
  }
  return (
    <nav className="flex justify-between items-center px-5 my-3 h-16">
      <div className="flex items-center">
        <MusicalNoteIcon className="h-8 w-8 mr-3 text-indigo-500 cursor-pointer" />
        {/* text-3xl: 文字サイズを30pxに設定、3xl=1.875rem (30px)、文字サイズのプリセット */}
        <span className="text-center text-3xl font-extrabold">
          Record Shop Manager
        </span>
      </div>
      {/* 横並びにするためflex指定(デフォルトで横並びに) */}
      <div className="flex items-center space-x-3">
        <div>
          {username ? (
            <div className="flex space-x-2">
              <span>{username}</span>
              <ArrowRightEndOnRectangleIcon
                className="h-6 w-6 text-blue-500 cursor-pointer"
                onClick={logout}
              />
            </div>
          ) : (
            <ArrowRightStartOnRectangleIcon
              className="h-6 w-6 my-6 text-blue-500 cursor-pointer"
              onClick={login}
            />
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
