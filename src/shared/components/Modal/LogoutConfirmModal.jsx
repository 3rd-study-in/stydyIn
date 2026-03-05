import Modal from '../../../atoms/Modal/Modal';
import FlexibleButton from '../../../atoms/Button/FlexibleButton';

function LogoutConfirmModal({ isOpen, onClose, onConfirm }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="bg-bg rounded-2xl p-1xl w-[320px] flex flex-col gap-5">
        <p className="text-center text-text font-medium">
          로그아웃 하시겠습니까?
        </p>
        <div className="flex gap-md">
          <FlexibleButton
            variant="white"
            size="M"
            className="flex-1 h-11"
            onClick={onClose}
          >
            취소
          </FlexibleButton>
          <FlexibleButton
            variant="blue"
            size="M"
            className="flex-1 h-11"
            onClick={onConfirm}
          >
            확인
          </FlexibleButton>
        </div>
      </div>
    </Modal>
  );
}

export default LogoutConfirmModal;
