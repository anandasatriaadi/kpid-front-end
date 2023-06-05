import httpRequest from "@/common/HttpRequest";
import EditUserForm from "@/components/admin/EditUserForm";
import UpdateUserRoleForm from "@/components/admin/UpdateUserRoleForm";
import Layout from "@/components/Layout";
import {
  ApplicationContext,
  ApplicationContextInterface,
} from "@/context/ApplicationContext";
import { AuthContext, AuthContextInterface } from "@/context/AuthContext";
import { NextPageWithLayout } from "@/pages/_app";
import UserData from "@/types/UserData";
import { isEmpty } from "@/utils/BooleanUtil";
import debounce, {
  debounceSuccessMessage,
  debounceErrorMessage,
} from "@/utils/Debounce";
import {
  faFilter,
  faPen,
  faShield,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Drawer,
  Form,
  message,
  Modal,
  Pagination,
  Popconfirm,
  Segmented,
  Spin,
  Table,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import moment from "moment";
import Head from "next/head";
import { useRouter } from "next/router";
import * as React from "react";

interface TableData extends UserData {
  key: React.Key;
}

type PageFilterType = {
  page: number;
  limit: number;
  sort?: string;
  status?: string;
};

const ManageUser: NextPageWithLayout = () => {
  //#region ::: Variable Initialisations
  const { isMobile } = React.useContext(
    ApplicationContext
  ) as ApplicationContextInterface;
  const { userData } = React.useContext(AuthContext) as AuthContextInterface;

  const [isFilterDrawerOpen, setIsFilterDrawerOpen] =
    React.useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = React.useState<boolean>(false);
  const [isReloading, setIsReloading] = React.useState<boolean>(true);

  const [modalType, setModalType] = React.useState<"edit" | "admin" | "none">(
    "edit"
  );

  const [usersData, setUsersData] = React.useState<TableData[]>([]);
  const [metadata, setMetadata] = React.useState<any>({});
  const [modalIndex, setModalIndex] = React.useState(0);

  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageFilter, setPageFilter] = React.useState<PageFilterType>({
    page: 0,
    limit: 10,
    sort: "name,DESC",
  });
  const queryParams = {
    params: { ...pageFilter },
  };

  const [form] = Form.useForm();
  const router = useRouter();

  // Filters
  const sortOptions: any[] = [
    { value: "name,ASC", label: "Nama" },
    { value: "email,ASC", label: "Email" },
    { value: "role,ASC", label: "Role" },
    { value: "last_login,DESC", label: "Login Terakhir" },
  ];
  //#endregion ::: Variable Initialisations

  //

  //#region :::
  const handleDeleteUser = async (data_index: number) => {
    await httpRequest
      .delete(`/users/${usersData[data_index]._id}`)
      .then((response) => {
        debounceSuccessMessage("Berhasil Menonaktifkan Pengguna");
        setPageFilter({ ...pageFilter });
        setIsEditModalOpen(false);
        setIsReloading(true);
      })
      .catch((err) => {
        if (err?.response?.data?.data !== undefined) {
          if (
            err.response.data.status !== 401 &&
            err.response.data.status !== 403
          ) {
            debounceErrorMessage(err.response.data.data);
          }
        }
        console.error(err);
      });
  };
  //#endregion ::: Handlers

  //

  //#region ::: Other Methods
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchUsers = debounce(() => {
    httpRequest
      .get(`/users`, queryParams)
      .then((response) => {
        const temp: UserData[] = response.data.data;
        const metadata: any = response.data.metadata;

        const result: TableData[] = temp.map((item, index) => {
          return { key: index, ...item };
        });

        setUsersData(result);
        setMetadata(metadata);
        setIsReloading(false);
      })
      .catch((err) => {
        if (err?.response?.data?.data !== undefined) {
          if (
            err.response.data.status !== 401 &&
            err.response.data.status !== 403
          ) {
            debounceErrorMessage(err.response.data.data);
          }
        }
        console.error(err);
      });
  }, 200);

  //#endregion ::: Other Methods

  //

  //#region ::: Renderers
  const RenderFilterBody = (): React.ReactElement => {
    return (
      <div className="flex flex-col">
        <p className="font-normal md:font-semibold">Urutkan</p>
        <div>
          <Segmented
            className="rounded-lg border-[1px] border-slate-300 bg-transparent p-0"
            options={sortOptions}
            onChange={(value) => {
              setIsReloading(true);
              if (!isEmpty(value))
                setPageFilter({
                  ...pageFilter,
                  sort: value.toString(),
                });
              else {
                const { sort, ...rest } = pageFilter;
                setPageFilter(rest);
              }
            }}
          />
        </div>
      </div>
    );
  };

  const RenderActionButtons = (value: any, record: any, index: number) => (
    <div className="flex flex-wrap justify-center gap-2">
      <span
        className={
          "rounded-lg p-2 transition-all duration-300" +
          (record.role === "admin" && record._id !== userData?._id
            ? " bg-slate-100 text-slate-700 hover:cursor-not-allowed"
            : " bg-amber-100 text-yellow-700 hover:cursor-pointer hover:bg-amber-200")
        }
        onClick={() => {
          if (record.role !== "admin" || record._id === userData?._id) {
            setIsEditModalOpen(!isEditModalOpen);
            setModalIndex(index);
            setModalType("edit");
            form.setFieldsValue({
              name: record.name,
              email: record.email,
            });
          }
        }}
      >
        <FontAwesomeIcon className="h-[16px]" icon={faPen} />
      </span>
      <span
        className={
          "rounded-lg p-2 transition-all duration-300" +
          (record.role === "admin" && record._id !== userData?._id
            ? " bg-slate-100 text-slate-700 hover:cursor-not-allowed"
            : " bg-sky-100 text-sky-700 hover:cursor-pointer hover:bg-sky-200")
        }
        onClick={() => {
          if (record.role !== "admin" || record._id === userData?._id) {
            setIsEditModalOpen(!isEditModalOpen);
            setModalIndex(index);
            setModalType("admin");
            form.setFieldsValue({
              name: record.name,
              email: record.email,
            });
          }
        }}
      >
        <FontAwesomeIcon className="h-[16px]" icon={faShield} />
      </span>
      <Popconfirm
        title="Yakin hapus pengguna ini?"
        onConfirm={() => {
          handleDeleteUser(index);
        }}
        okText="Ya"
        cancelText="Tidak"
        disabled={record.role === "admin" && record._id !== userData?._id}
      >
        <span
          className={
            "rounded-lg p-2 transition-all duration-300" +
            (record.role === "admin" && record._id !== userData?._id
              ? " bg-slate-100 text-slate-700 hover:cursor-not-allowed"
              : " bg-red-100 text-red-700 hover:cursor-pointer hover:bg-red-200")
          }
        >
          <FontAwesomeIcon className="h-[16px]" icon={faTrash} />
        </span>
      </Popconfirm>
    </div>
  );
  //#endregion ::: Renderers

  //

  //#region ::: Form columns
  const columns: ColumnsType<TableData> = [
    { title: "Nama", dataIndex: "name", key: "name" },
    { title: "Email", dataIndex: "email", key: "email" },
    {
      title: "Peran",
      dataIndex: "role",
      key: "role",
      render: (value) => (
        <span
          className={
            "rounded-lg py-1 px-2 " +
            (value === "admin" ? "bg-sky-100 text-sky-700" : "bg-slate-100")
          }
        >
          {value}
        </span>
      ),
    },
    {
      title: "Login Terakhir",
      dataIndex: "last_login",
      key: "last_login",
      render: (val) => {
        return <span>{moment(val).format("HH:mm:ss DD MMMM YYYY")}</span>;
      },
    },
    {
      title: "Aksi",
      dataIndex: "",
      key: "x",
      render: RenderActionButtons,
    },
  ];
  //#endregion ::: Form Columns

  //

  //#region ::: UseEffect
  React.useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageFilter]);
  //#endregion ::: UseEffect
  if (userData?.role !== "admin") {
    router.push("/");
    return <></>;
  }

  return (
    <div className="flex flex-1 flex-col">
      <Head>
        <title>Manajemen Pengguna | KPID Jawa Timur</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1 className="mb-4 text-xl font-semibold md:text-2xl">
        Daftar Pengguna
      </h1>
      <section className="mb-4 rounded-lg bg-white py-2 px-4 shadow-custom md:p-4">
        {isMobile ? (
          <>
            <div className="mb-4 flex justify-between">
              <span
                className="flex cursor-pointer items-center gap-2 rounded-lg bg-sky-100 px-2 py-1 text-sky-700 hover:shadow-custom"
                onClick={() => {
                  setIsFilterDrawerOpen(!isFilterDrawerOpen);
                }}
              >
                <FontAwesomeIcon className="h-[16px]" icon={faFilter} />
                <p className="text-base">Filter</p>
              </span>
            </div>
            <Drawer
              title="Filter"
              open={isFilterDrawerOpen}
              onClose={() => setIsFilterDrawerOpen(false)}
            >
              {RenderFilterBody()}
            </Drawer>
          </>
        ) : (
          <div className="mb-2 flex justify-between">{RenderFilterBody()}</div>
        )}

        <Spin spinning={isReloading}>
          <Table columns={columns} dataSource={usersData} pagination={false} />
          <Pagination
            className="mt-4 flex justify-center rounded-lg border-[1px] border-slate-100 py-2"
            total={
              metadata?.total_elements === undefined
                ? 0
                : metadata?.total_elements
            }
            pageSizeOptions={[10, 20, 40]}
            defaultPageSize={10}
            current={currentPage}
            showSizeChanger
            showTotal={(total, range) => {
              return `${range[0]}-${range[1]} of ${total} items`;
            }}
            onChange={(page, pageSize) => {
              setCurrentPage(page);
              setIsReloading(true);
              setPageFilter({
                ...pageFilter,
                page: page - 1,
                limit: pageSize,
              });
            }}
          />
        </Spin>
      </section>

      <Modal
        title={
          modalType === "admin" ? "Ubah Akses Admin" : "Edit Data Pengguna"
        }
        open={isEditModalOpen}
        onCancel={() => {
          setModalType("none");
          setIsEditModalOpen(false);
        }}
        footer={null}
      >
        {modalType === "admin" && (
          <UpdateUserRoleForm
            form={form}
            usersData={usersData}
            userIndex={modalIndex}
            pageFilter={pageFilter}
            setPageFilter={setPageFilter}
            setIsModalOpen={setIsEditModalOpen}
            setIsReloading={setIsReloading}
          />
        )}
        {modalType === "edit" && (
          <EditUserForm
            form={form}
            usersData={usersData}
            userIndex={modalIndex}
            pageFilter={pageFilter}
            setPageFilter={setPageFilter}
            setIsModalOpen={setIsEditModalOpen}
            setIsReloading={setIsReloading}
          />
        )}
      </Modal>
    </div>
  );
};

export default ManageUser;

ManageUser.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};
