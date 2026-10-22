import { useState, useEffect, useMemo } from "react";

import useAuthFetch from "../../../../../hooks/useAuthFetch";
import useConfig from "../../../../../hooks/useConfig";
import useModal from "../../../../../hooks/useModal";
import useToast from "../../../../../hooks/useToast";
import Button from "../../../../UI/Button/Button";
import DataTable from "../../../../UI/DataTable/DataTable";
import { createColumnHelper } from "@tanstack/react-table";
import UserCard from "./UserCard";
import Chip from "@/components/UI/Chip/Chip";
import ProfileImage from "@/components/UI/Utility/ProfileImage/ProfileImage";
import FiltersCard from "./FiltersCard";
function useDebounce(value, delay = 400) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

const UsersManagerView = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [usersCount, setUsersCount] = useState();
  const [pageCount, setPageCount] = useState();
  const { config } = useConfig();
  const authFetch = useAuthFetch();
  const { showToast } = useToast();
  const { openModal } = useModal();
  const [limit, setLimit] = useState(20);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    status: [],
    roles: [],
    createdAtFrom: null,
    createdAtTo: null,
  });
  const filtersOptions = [
    {
      label: "status",
      value: filters.status,
      type: "multiple",
      options: [
        { label: "Online", value: "online" },
        { label: "Offline", value: "offline" },
        { label: "Banned", value: "banned" },
      ],
      onChange: (value) =>
        setFilters((prev) => ({
          ...prev,
          status: value || [],
        })),
    },
    {
      label: "roles",
      value: filters.roles,
      type: "multiple",
      options: [
        { label: "Admin", value: "ADMIN" },
        { label: "Moderator", value: "MODERATOR" },
        { label: "Owner", value: "OWNER" },
      ],
      onChange: (value) =>
        setFilters((prev) => ({
          ...prev,
          roles: value || [],
        })),
    },
    {
      label: "Registration date",
      startValue: filters.createdAtFrom,
      endValue: filters.createdAtTo,
      type: "date-range",
      onStartDateChange: (value) =>
        setFilters((prev) => ({ ...prev, createdAtFrom: value })),
      onEndDateChange: (value) =>
        setFilters((prev) => ({ ...prev, createdAtTo: value })),
    },
  ];

  const [page, setPage] = useState(0);
  const useDebounce = (value, delay = 300) => {
    const [debounced, setDebounced] = useState(value);

    useEffect(() => {
      const timer = setTimeout(() => setDebounced(value), delay);
      return () => clearTimeout(timer);
    }, [value, delay]);

    return debounced;
  };

  const getUsers = async () => {
    try {
      setIsLoading(true)
      const res = await authFetch(
        `${config.serverURL}/user?limit=${limit}&page=${page}&searchTerm=${searchTerm}&filters=${JSON.stringify(filters)}`,
      );
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
      setUsersCount(data.totalUsers);
      setPageCount(data.totalPages);
      setIsLoading(false)
    } catch (error) {
      console.error("Failed to fetch users", error);
      showToast(error.message || 'error while attempting to fetch users', "error");
      setUsers([]);
      setIsLoading(false)
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
  const debouncedSearch = useDebounce(searchTerm, 500);

  useEffect(() => {
    getUsers();
  }, [debouncedSearch, page, limit, filters]);

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
            <div className="flex gap-1em">
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

  useEffect(() => {
    return () => {};
  }, [limit, page]);

  return (
    <div className="UsersManagerView view">
      <DataTable
        columnDefs={columns}
        data={users}
        rowSelection
        actionSets={[{ label: "Delete", callBack: () => {} }]}
        pagination={{ pageSize: limit, pageIndex: page }}
        rowCount={usersCount}
        page={page}
        limit={limit}
        limitOptions={[20, 30, 40, 50, 60]}
        pageCount={pageCount}
        setPage={(page) => {
          setPage(page);
        }}
        setLimit={(limit) => {
          setLimit(limit);
        }}
        searchTerm={searchTerm}
        onSearchChange={(value) => {
          setPage(0);
          setSearchTerm(value);
        }}
        filters={filters}
        filtersOptions={filtersOptions}
        isLoading={isLoading}
      />
     
    </div>
  );
};

export default UsersManagerView;
