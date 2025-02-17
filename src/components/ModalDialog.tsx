// ModalDialog.tsx
type ModalDialogProps = {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
}

const ModalDialog: React.FC<ModalDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null // モーダルが開いていない場合は表示しない

  return (
    <div className="fixed inset-0 flex justify-center items-center z-50">
      {/*この独立したdivで画面全体を半透明に出来る理由はabsoluteとinset-0で親のdivのサイズ全部を覆っているから
      absolute: このプロパティは、要素を親要素に対して絶対位置で配置することを意味する
      inset-0: これは、上右下左の各辺を0に設定、親要素にぴったりとフィットさせる */}
      <div className="absolute inset-0 bg-black opacity-50" />

      <div className="bg-white p-6 rounded-lg shadow-xl text-center z-60">
        <h2 className="text-lg font-semibold mb-4">Confirmation of deletion</h2>
        <p className="mb-4">Do you really want to delete it?</p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Yes
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
          >
            No
          </button>
        </div>
      </div>
    </div>
  )
}

export default ModalDialog
