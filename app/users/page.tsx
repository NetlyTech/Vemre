"use client";
import { useState } from "react";
import Image from "next/image";
import dayjs from "@/lib/dayjs"
import UserQueries from "@/requestapi/queries/userQueries"
import { getError } from "@/lib/requestError";
import OverlayLoader from "@/components/OverLayLoader";
const {useAllKycs, setKycStatus} = new UserQueries();

export default function UsersPage() {
  // Example users — replace with API/DB data
  const [query, setQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<any>(null);
   const {data} = useAllKycs();

   const {mutateAsync, isPending} = setKycStatus()
console.log(data)

   const allUsers = data?.data.map(v => {
    
    return   {
      id: v._id,
      name: v.user.fullname,
      email: v.user.email,
      phone: v.user.phone_number,
      avatar: v.user.avatar || "https://avatar.iran.liara.run/public",
      location: v.user.location,
      lastActive: dayjs(v.user.lastActive ).format("MMM D, YYYY, hh:mm A"),
      documentUrl: v.avatar,
      admin_verify_status: v.admin_verify_status,
    }
   })  || []




  // Filter users
  const filtered = allUsers.filter(u =>
    `${u.name} ${u.email} ${u.phone}`
      .toLowerCase()
      .includes(query.toLowerCase())
  );



  const handleStatusApproval = async(admin_verify_status: "approved" | "rejected") => {

    try {

      
     await mutateAsync({admin_verify_status, id: selectedUser.id});
    } catch (error) {
       const Error = getError(error);
        window.alert(Error)
    }
  }

  return (
    <div className="max-w-5xl mx-auto p-8">

      {(!data?.data || isPending) && <OverlayLoader />}
      <h1 className="text-3xl font-semibold mb-6">User Management</h1>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by name, email, or phone…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full p-3 border rounded-lg shadow-sm"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* User List */}
        <div className="border rounded-lg p-4 shadow bg-white max-h-[500px] overflow-auto">
          <h2 className="text-xl font-semibold mb-3">Users</h2>

          {filtered.length === 0 && (
            <p className="text-gray-500">No users found.</p>
          )}

          {filtered.map((user) => (
            <div
              key={user.id}
              onClick={() => setSelectedUser(user)}
              className={`p-3 rounded cursor-pointer flex items-center gap-3 hover:bg-gray-100 ${
                selectedUser?.id === user.id ? "bg-gray-200" : ""
              }`}
            >
              <Image
                src={user.avatar}
                alt={user.name}
                width={40}
                height={40}
                className="rounded-full"
              />


              <div className="flex-1">
  <p className="font-medium">{user.name}</p>

  <p className="text-sm text-gray-600 truncate max-w-[140px] overflow-hidden text-ellipsis">
    {user.email}
  </p>

  <span
    className={`
      inline-block mt-1 px-2 py-0.5 text-xs font-semibold rounded
      ${
        user.admin_verify_status === "approved"
          ? "bg-green-100 text-green-800"
          : user.admin_verify_status === "rejected"
          ? "bg-red-100 text-red-800"
          : "bg-yellow-100 text-yellow-800"
      }
    `}
  >
    {user.admin_verify_status}
  </span>
</div>



            </div>
          ))}
        </div>

        {/* Details Panel */}
        <div className="md:col-span-2">
          {selectedUser ? (
            <div className="p-6 bg-white border rounded-lg shadow">
              <div className="flex items-center gap-4">
                <Image
                  src={selectedUser.avatar}
                  alt={selectedUser.name}
                  width={90}
                  height={90}
                  className="rounded-full"
                />
                <div>
                  <h2 className="text-2xl font-semibold">
                    {selectedUser.name}
                  </h2>
                  <p>{selectedUser.email}</p>
                  <p>{selectedUser.phone}</p>
                </div>
              </div>

              <div className="mt-6 space-y-2 text-gray-800">
                <p>
                  <strong>Location:</strong> {selectedUser.location.formattedAddress}, {selectedUser.location.region} {selectedUser.location.country}
                </p>
                <p>
                  <strong>Postal Code:</strong> {selectedUser.location.postalCode}
                </p>


                <p>
                  <strong>Last Active:</strong> {selectedUser.lastActive}
                </p>
                <p>
                  <strong>Uploaded Document:</strong>{" "}
                  <a
                    href={selectedUser.documentUrl}
                    target="_blank"
                    className="text-blue-600 underline"
                  >
                    View Document
                  </a>
                </p>
              </div>

              {/* Approve / Reject Buttons */}
              {selectedUser.admin_verify_status === "pending" && <div className="mt-6 flex gap-4">
                <button onClick={() => handleStatusApproval("approved") } className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                  Approve
                </button>
                <button onClick={() => handleStatusApproval("rejected") } className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
                  Reject
                </button>
              </div>}
              
            </div>
          ) : (
            <div className="p-6 text-gray-500 border rounded-lg bg-white shadow">
              Select a user to view details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
