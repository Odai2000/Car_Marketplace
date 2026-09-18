import { useState, useEffect, useMemo } from "react";

import useAuthFetch from "../../../../../hooks/useAuthFetch";
import useConfig from "../../../../../hooks/useConfig";
import useModal from "../../../../../hooks/useModal";
import useToast from "../../../../../hooks/useToast";
import Button from "../../../../UI/Button/Button";
import DataTable from "../../../../UI/DataTable/DataTable";
import { createColumnHelper } from "@tanstack/react-table";
import UserCard from "./UserCard";
import { text } from "@fortawesome/fontawesome-svg-core";
import Chip from "@/components/UI/Chip/Chip";
import ProfileImage from "@/components/UI/Utility/ProfileImage/ProfileImage";

const UserManagerView = () => {
  const [users, setUsers] = useState([]);
  const { config } = useConfig();
  const authFetch = useAuthFetch();
  const { showToast } = useToast();
  const { openModal } = useModal();

  const getUsers = async () => {
    try {
      const res = await authFetch(`${config.serverURL}/user`);
      if (!res || !res.ok) {
        setUsers([]);
        let errorMsg = "";
        res?.status === 403
          ? (errorMsg = "Unauthorized action.")
          : "Unexcepted error.";
        throw new Error(errorMsg);
      }

      const data = await res.json();
      // backend might return { users: [...] } or an array directly
      setUsers(data.users || data || []);
    } catch (error) {
      console.error("Failed to fetch users", error);
      showToast(error.message, "error");
      setUsers([]);
    }
  };

  const editUser = async (_id) => {
    try {
      await authFetch(`${config.serverURL}/user/${_id}`, {
        method: "PATCH",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ roles: [roles] }),
      });
    } catch (error) {}
  };
  useEffect(() => {
    getUsers();
  }, []);

  const handleViewClick = (_id) => {
    const user = users.find((user) => user._id === _id);
    console.log(user);
    openModal(<UserCard user={user}></UserCard>);
  };

  const columnHelper = createColumnHelper();

  const columns = useMemo(
    () => [
      // columnHelper.accessor("_id", {
      //   header: "id",
      //   cell: (info) => info.getValue(),
      // }),
      columnHelper.display({
        id: "user",
        header: "User",
        cell: (props) => {
          return (
            <div class="flex gap-1em">
              <ProfileImage
                size="3rem"
                round
                src={props?.row?.original?.profileImageUrl}
              />
              <div className="flex-col">
                <h2>{`${props?.row?.original?.name}`}</h2>
                <h5>{`@${props?.row?.original?.username}`}</h5>
              </div>
            </div>
          );
        },
      }),
      columnHelper.accessor("username", {
        id: "username",
        header: "User",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor(
        (row) => `${row.firstName || ""} ${row.lastName || ""}`,
        {
          header: "Name",
          cell: (info) => info.getValue(),
        },
      ),
      columnHelper.accessor("email", {
        header: "Email",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("roles", {
        header: "Roles",
        meta: { cellClassName: "" },
        cell: (info) => {
          const roles = info.getValue();
          return (
            <div className="flex gap-05em font-sm">
              {roles.map((role) => (
                <Chip
                  key={role}
                  style={
                    role === "ADMIN" || "MODERATOR" || "USER"
                      ? {
                          backgroundColor: `var(--role-${role.toLowerCase()}-light)`,
                          color: `var(--role-${role.toLowerCase()})`,
                          border: "none",
                        }
                      : {}
                  }
                >
                  {role}
                </Chip>
              ))}
            </div>
          );
        },
      }),
      columnHelper.display({
        header: "Actions",
        cell: (props) => {
          return (
            <div className="btn-group">
              <Button
                variant="link"
                onClick={() => handleViewClick(props.row.original._id)}
              >
                view
              </Button>
              <Button variant="link" destructive>
                Delete
              </Button>
            </div>
          );
        },
      }),
    ],
    [columnHelper],
  );

  return (
    <div className="UserManagerView view">
      <DataTable
        columnDefs={columns}
        data={users}
        rowSelection
        actionSets={<Button variant="link destructive">Delete</Button>}
      />
    </div>
  );
};

export default UserManagerView;
