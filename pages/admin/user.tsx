import httpRequest from "@/common/HttpRequest";
import Layout from "@/components/Layout";
import {
  ApplicationContext,
  ApplicationContextInterface,
} from "@/context/ApplicationContext";
import { NextPageWithLayout } from "@/pages/_app";
import UserData from "@/types/UserData";
import { faFilter, faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Button,
  Divider,
  Drawer,
  Form,
  Input,
  message,
  Modal,
  Pagination,
  Popconfirm,
  Spin,
  Table,
} from "antd";
import Head from "next/head";
import * as React from "react";
import type { ColumnsType } from "antd/es/table";

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

  const [filterDrawerOpen, setFilterDrawerOpen] =
    React.useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = React.useState<boolean>(false);
  const [isReloading, setIsReloading] = React.useState<boolean>(true);

  const [usersData, setUsersData] = React.useState<TableData[]>([]);
  const [metadata, setMetadata] = React.useState<any>({});
  const [modalIndex, setModalIndex] = React.useState(0);

  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageFilter, setPageFilter] = React.useState<PageFilterType>({
    page: 0,
    limit: 20,
    sort: "name,DESC",
  });
  const queryParams = {
    params: { ...pageFilter },
  };

  const [form] = Form.useForm();

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
            (value === "admin" ? "bg-sky-100 text-sky-600" : "bg-slate-100")
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
      render: (value, record, index) => (
        <div className="flex flex-wrap gap-1">
          <span
            className="rounded-lg bg-sky-100 p-2 text-slate-700 transition-all duration-300 hover:cursor-pointer hover:bg-sky-300"
            onClick={() => {
              setIsEditModalOpen(!isEditModalOpen);
              setModalIndex(index);
            }}
          >
            <FontAwesomeIcon height={16} icon={faPen} />
          </span>
          <Popconfirm
            title="Yakin hapus pengguna ini?"
            onConfirm={handleDeleteUser}
            okText="Yes"
            cancelText="No"
          >
            <span className="rounded-lg bg-orange-100 p-2 text-slate-700 transition-all duration-300 hover:cursor-pointer hover:bg-orange-300">
              <FontAwesomeIcon height={16} icon={faTrash} />
            </span>
          </Popconfirm>
        </div>
      ),
    },
  ];
  //#endregion ::: Variable Initialisations

  //

  //#region ::: Handlers
  const handleEditUser = (
    e: React.MouseEvent<HTMLElement, MouseEvent> | undefined
  ) => {
    form.validateFields().then((values) => {
      httpRequest.put(`/users`, values).then((response) => {
        message.success("Berhasil mengubah pengguna");
        setPageFilter({ ...pageFilter });
        setIsEditModalOpen(false);
        setIsReloading(true);
        form.resetFields();
      });
    });
  };
  const handleDeleteUser = (
    e: React.MouseEvent<HTMLElement, MouseEvent> | undefined
  ) => {
    console.log(e);
    message.success("Click on Yes");
  };

  const handleForm = (values: any) => {
    console.log(values);
  };

  const handleFormFailed = (errorInfo: any) => {
    console.error("Failed:", errorInfo);
  };
  //#endregion ::: Handlers

  //

  //#region ::: Other Methods
  const RenderFilterBody = (): React.ReactElement => {
    return (
      <div className="flex flex-col flex-wrap md:flex-row md:justify-between">
        <div className="grid flex-wrap gap-4 md:flex">
          <div className="flex flex-col gap-1 text-sm">
            <p>Status</p>
          </div>
        </div>
      </div>
    );
  };
  //#endregion ::: Other Methods

  //

  //#region ::: UseEffect
  React.useEffect(() => {
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
        console.error(err);
      });
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
          <div className="flex">
            <span
              className="flex cursor-pointer items-center gap-2 rounded-lg bg-sky-100 px-2 py-1 text-sky-600 hover:shadow-custom"
              onClick={() => {
                setFilterDrawerOpen(!filterDrawerOpen);
              }}
            >
              <FontAwesomeIcon height={16} icon={faFilter} />
              <p className="text-base">Filter</p>
            </span>
          </div>
        ) : (
          <>
            <p className="text-base font-semibold md:text-lg">Filter</p>
            <Divider className="my-2" />
          </>
        )}
        {isMobile ? (
          <Drawer
            title="Filter"
            open={filterDrawerOpen}
            onClose={() => setFilterDrawerOpen(false)}
          >
            {RenderFilterBody()}
          </Drawer>
        ) : (
          RenderFilterBody()
        )}
      </section>
      <section className="mb-4 rounded-lg bg-white py-2 px-4 shadow-custom md:p-4">
        <Spin spinning={isReloading}>
          <Table columns={columns} dataSource={usersData} pagination={false} />
          <Pagination
            className="mt-4 flex justify-center rounded-lg border-[1px] border-slate-100 py-2"
            total={
              metadata?.total_elements === undefined
                ? 0
                : metadata?.total_elements
            }
            pageSizeOptions={[20, 40, 80]}
            defaultPageSize={20}
            current={currentPage}
            showSizeChanger
            showTotal={(total, range) => {
              console.log(total, range);
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
        title="Edit Data Pengguna"
        open={isEditModalOpen}
        onCancel={() => {
          setIsEditModalOpen(false);
          setModalIndex(-1);
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
            <Input />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Silakan masukkan email Anda" },
              { type: "email", message: "Alamat email tidak valid!" },
            ]}
          >
            <Input />
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
              <Popconfirm
                title="Yakin ubah pengguna ini?"
                onConfirm={handleEditUser}
                okText="Ya"
                cancelText="Tidak"
              >
                <Button type="primary">Ubah Data</Button>
              </Popconfirm>
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
