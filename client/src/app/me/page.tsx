import User from "@/components/User";

export default function UserPage() {
  return (
    <div className="flex md:flex-col flex-row items-center">
      <div className="bg-white min-w-content rounded-xl md:p-20 p-7 shadow-md">
        <User />
      </div>
    </div>
  );
}
