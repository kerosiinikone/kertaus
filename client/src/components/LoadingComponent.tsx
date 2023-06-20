const LoadingComponent: React.FC = () => {
  return (
    <div className="flex flex-col justify-center items-center bg-gradient-to-l from-neutral-100 to-neutral-150 min-w-content md:mx-10 mx-0 rounded-2xl shadow-lg md:p-2 p-0">
      <div className="flex flex-col justify-center items-center space-y-10 bg-white min-w-content rounded-xl md:p-20 p-7">
        Loading
      </div>
    </div>
  );
};

export default LoadingComponent;
