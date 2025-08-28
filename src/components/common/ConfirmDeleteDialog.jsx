// src/components/common/ConfirmDialog.jsx
import PropTypes from "prop-types";
import Modal from "react-modal";
import {TailSpin} from "react-loader-spinner";

Modal.setAppElement("#root");

export default function ConfirmDialog({ isOpen, title, message, onConfirm, onCancel, isDeleting }) {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onCancel}
      className="max-w-md mx-auto mt-32 bg-gray-100 p-6 rounded-lg shadow-lg outline-none text-black"
      overlayClassName="fixed inset-0 bg-black/50 flex items-start justify-center z-50"
    >
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <p className="mb-6">{message}</p>
      <div className="flex justify-end gap-3">
        <button
          onClick={onCancel}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          {isDeleting ? (
            <TailSpin
              height="20"
              width="20"
              color="#fff"
              ariaLabel="tail-spin-loading"
              radius="1"
              wrapperStyle={{}}
              wrapperClass=""
              visible={true}
            />
          ) : (
            "Delete"
          )}
        </button>
      </div>
    </Modal>
  );
}

ConfirmDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  title: PropTypes.string,
  message: PropTypes.string,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};
