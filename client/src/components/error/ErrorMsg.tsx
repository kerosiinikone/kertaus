import { ApolloError } from "@apollo/client";

interface ErrorMsgProps {
  error: (ApolloError | undefined)[];
}

const ErrorMsg: React.FC<ErrorMsgProps> = ({ error }) => {
  return (
    <div className="fixed w-full h-16 bg-red-500 bottom-0">
      <div className="flex flex-row items-center p-5">
        <p>
          <h2 className="text-white font-semibold">Error:</h2>
        </p>
        {error.map((e) => (
          <p className="ml-2">
            <h2 className="text-white">{`${e?.message}`}</h2>
          </p>
        ))}
      </div>
    </div>
  );
};

export default ErrorMsg;
