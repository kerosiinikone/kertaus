interface DeleteModal {
  setOpenDeleteModal: (state: boolean) => void;
  deleteModal: () => void;
}

const DeleteModal: React.FC<DeleteModal> = ({
  setOpenDeleteModal,
  deleteModal,
}) => {
  return (
    <div className="flex justify-center items-center fixed w-screen h-screen bg-white bg-opacity-60">
      <div className="flex flex-col justify-center space-y-2 rounded-[2rem] bg-white p-10 shadow-md m-5 items-center fixed top-[45vh]">
        <div>
          <h1 className="mt-5 text-slate-400 text-lg">
            Haluatko varmasti poistaa aikataulun?
          </h1>
        </div>
        <div className="flex flex-row justify-between items-center space-x-4">
          <button
            onClick={deleteModal}
            className="p-2 rounded-lg bg-red-400 text-white hover:bg-red-500 transition"
          >
            Poista
          </button>
          <button
            onClick={() => setOpenDeleteModal(false)}
            className="p-2 rounded-lg bg-slate-400 text-white hover:bg-slate-500 transition"
          >
            Hylkää
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
