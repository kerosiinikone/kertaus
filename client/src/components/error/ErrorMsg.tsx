import { ApolloError } from "@apollo/client";

interface ErrorMsgProps {
  error: (ApolloError | undefined | Error)[];
}

const ErrorMsg: React.FC<ErrorMsgProps> = ({ error }) => {
  return (
    <div className="fixed w-full h-16 bg-red-500 bottom-0">
      <div className="flex flex-row items-center p-5">
        <span>
          <h2 className="text-white font-semibold">Error:</h2>
        </span>
        {error.map((e, i) => (
          <span className="ml-2" key={i}>
            <h2 className="text-white">{`${e?.message}`}</h2>
          </span>
        ))}
      </div>
    </div>
  );
};

export default ErrorMsg;
