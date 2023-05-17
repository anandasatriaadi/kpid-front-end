import httpRequest from "@/common/HttpRequest";
import Layout from "@/components/Layout";
import {
  ApplicationContext,
  ApplicationContextInterface,
} from "@/context/ApplicationContext";
import { AuthContext, AuthContextInterface } from "@/context/AuthContext";
import { NextPageWithLayout } from "@/pages/_app";
import UserData from "@/types/UserData";
import { isEmpty } from "@/utils/BooleanUtil";
import debounce from "@/utils/Debounce";
import {
  faFilter,
  faPen,
  faShield,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Button,
  Drawer,
  Form,
  Input,
  message,
  Modal,
  Pagination,
  Popconfirm,
  Segmented,
  Spin,
  Table,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import Head from "next/head";
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
  const [modalType, setModalType] = React.useState<"edit" | "admin">("edit");

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

  // Filters
  const sortOptions: any[] = [
    { value: "name,ASC", label: "Nama" },
    { value: "email,ASC", label: "Email" },
    { value: "role,ASC", label: "Role" },
    { value: "last_login,DESC", label: "Login Terakhir" },
  ];
  //#endregion ::: Variable Initialisations

  //

  //#region ::: Handlers
  const handleEditUser = (
    e: React.MouseEvent<HTMLElement, MouseEvent> | undefined
  ) => {
    form.validateFields().then((values) => {
      values = { ...values, user_id: userData?._id };
      httpRequest.put(`/users`, values).then((response) => {
        message.success("Berhasil mengubah pengguna");
        setPageFilter({ ...pageFilter });
        setIsEditModalOpen(false);
        setIsReloading(true);
        form.resetFields();
      });
    });
  };

  const handleDeleteUser = (data_index: number) => {
    httpRequest
      .delete(`/users/${usersData[data_index]._id}`)
      .then((response) => {
        message.success("Berhasil menonaktifkan pengguna");
        setPageFilter({ ...pageFilter });
        setIsEditModalOpen(false);
        setIsReloading(true);
        form.resetFields();
      });
  };

  const handleUpdateUserRole = (role: string) => {
    form.validateFields().then((values) => {
      values = { user_id: usersData[modalIndex]._id, role: role };
      httpRequest.put(`/users/role`, values).then((response) => {
        message.success("Berhasil mengubah role pengguna");
        setPageFilter({ ...pageFilter });
        setIsEditModalOpen(false);
        setIsReloading(true);
        form.resetFields();
      });
    });
  };
  //#endregion ::: Handlers

  //

  //#region ::: Other Methods
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchUsers = React.useCallback(
    debounce(() => {
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
          if (err?.response?.data !== undefined && err.response !== null) {
            message.error(err.response.data);
          }
          console.error(err);
        });
    }, 200),
    [pageFilter]
  );

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
        <FontAwesomeIcon height={16} icon={faPen} />
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
        <FontAwesomeIcon height={16} icon={faShield} />
      </span>
      <Popconfirm
        title="Yakin hapus pengguna ini?"
        onConfirm={() => {
          handleDeleteUser(index);
        }}
        okText="Yes"
        cancelText="No"
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
          <FontAwesomeIcon height={16} icon={faTrash} />
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
      title: "Role",
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
    { title: "Login Terakhir", dataIndex: "last_login", key: "last_login" },
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
                className="flex cursor-pointer items-center gap-2 rounded-lg bg-sky-100 px-2 py-1 text-sky-600 hover:shadow-custom"
                onClick={() => {
                  setIsFilterDrawerOpen(!isFilterDrawerOpen);
                }}
              >
                <FontAwesomeIcon height={16} icon={faFilter} />
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
          setIsEditModalOpen(false);
          form.resetFields();
        }}
        footer={null}
      >
        <Form
          name="login_form"
          form={form}
          autoComplete="off"
          layout="vertical"
          requiredMark={"optional"}
        >
          <Form.Item
            label="Nama"
            name="name"
            rules={[{ required: true, message: "Silakan masukkan nama Anda" }]}
          >
            <Input disabled={modalType === "admin"} />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Silakan masukkan email Anda" },
              { type: "email", message: "Alamat email tidak valid!" },
            ]}
          >
            <Input disabled={modalType === "admin"} />
          </Form.Item>

          <Form.Item>
            <div className="flex justify-end gap-4">
              <Button
                onClick={() => {
                  setIsEditModalOpen(false);
                }}
              >
                Batal
              </Button>
              {modalType === "admin" ? (
                <>
                  {usersData[modalIndex]._id === userData?._id ? (
                    <Popconfirm
                      title={
                        <div className="max-w-[48ch]">
                          <div className="font-semibold capitalize">
                            Yakin hapus akses admin anda?
                          </div>
                          Aksi ini tidak dapat diurungkan. Anda akan kehilangan
                          akses halaman admin
                        </div>
                      }
                      onConfirm={() => handleUpdateUserRole("user")}
                      okText="Ya"
                      cancelText="Tidak"
                    >
                      <Button type="primary" danger>
                        Deaktivasi Admin
                      </Button>
                    </Popconfirm>
                  ) : (
                    <Popconfirm
                      title={
                        <div className="max-w-[48ch]">
                          <div className="font-semibold capitalize">
                            Yakin tambahkan pengguna sebagai admin?
                          </div>
                          Aksi ini tidak dapat diurungkan. Pengguna harus
                          mendeaktivasi diri sendiri ketika sudah menjadi admin
                        </div>
                      }
                      onConfirm={() => handleUpdateUserRole("admin")}
                      okText="Ya"
                      cancelText="Tidak"
                    >
                      <Button type="primary">Aktivasi Admin</Button>
                    </Popconfirm>
                  )}
                </>
              ) : (
                <Popconfirm
                  title="Yakin ubah pengguna ini?"
                  onConfirm={handleEditUser}
                  okText="Ya"
                  cancelText="Tidak"
                >
                  <Button type="primary">Ubah Data</Button>
                </Popconfirm>
              )}
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ManageUser;

ManageUser.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};
