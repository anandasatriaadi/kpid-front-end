import httpRequest from "@/common/HttpRequest";
import Layout from "@/components/Layout";
import {
  ApplicationContext,
  ApplicationContextInterface,
} from "@/context/ApplicationContext";
import { AuthContext, AuthContextInterface } from "@/context/AuthContext";
import { NextPageWithLayout } from "@/pages/_app";
import Station from "@/types/Station";
import { isEmpty } from "@/utils/BooleanUtil";
import debounce, {
  debounceSuccessMessage,
  debounceErrorMessage,
} from "@/utils/Debounce";
import { tokenizeString } from "@/utils/StringUtil";
import { faFilter, faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
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
import moment from "moment";
import Head from "next/head";
import { useRouter } from "next/router";
import * as React from "react";

type PageFilterType = {
  page: number;
  limit: number;
  sort?: string;
  status?: string;
};

const ManageStation: NextPageWithLayout = () => {
  //#region ::: Variable Initialisations
  const { isMobile } = React.useContext(
    ApplicationContext
  ) as ApplicationContextInterface;
  const { userData } = React.useContext(AuthContext) as AuthContextInterface;

  const [isFilterDrawerOpen, setIsFilterDrawerOpen] =
    React.useState<boolean>(false);
  const [isModalOpen, setModalOpen] = React.useState<boolean>(false);
  const [isReloading, setIsReloading] = React.useState<boolean>(true);
  const [modalType, setModalType] = React.useState<"add" | "edit">("edit");

  const [stationsData, setStationsData] = React.useState<Station[]>([]);
  const [metadata, setMetadata] = React.useState<any>({});
  const [modalIndex, setModalIndex] = React.useState(0);

  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageFilter, setPageFilter] = React.useState<PageFilterType>({
    page: 0,
    limit: 10,
    sort: "key,ASC",
  });
  const queryParams = {
    params: { ...pageFilter },
  };

  const [form] = Form.useForm();
  const router = useRouter();

  // Filters
  const sortOptions: any[] = [
    { value: "key,ASC", label: "ID" },
    { value: "name,ASC", label: "Nama" },
    { value: "created_at,DESC", label: "Tanggal Dibuat" },
  ];
  //#endregion ::: Variable Initialisations

  //

  //#region ::: Handlers
  const handleEditStation = (
    e: React.MouseEvent<HTMLElement, MouseEvent> | undefined
  ) => {
    form.validateFields().then((values) => {
      httpRequest
        .put(`/stations`, {
          old_key: stationsData[modalIndex].key,
          station_name: values["station_name"],
        })
        .then((response) => {
          debounceSuccessMessage("Berhasil Mengubah Stasiun");
          setPageFilter({ ...pageFilter });
          setModalOpen(false);
          setIsReloading(true);
          form.resetFields();
        });
    });
  };

  const handleAddStation = (
    e: React.MouseEvent<HTMLElement, MouseEvent> | undefined
  ) => {
    form
      .validateFields()
      .then((values) => {
        httpRequest
          .post(`/stations`, {
            station_name: values["station_name"],
          })
          .then((response) => {
            debounceSuccessMessage("Berhasil Menambahkan Stasiun");
            setPageFilter({ ...pageFilter });
            setModalOpen(false);
            setIsReloading(true);
            form.resetFields();
          });
      })
      .catch((err) => {
        if (err?.response?.data?.data !== undefined) {
          if (
            err.response.data.status !== 401 &&
            err.response.data.status !== 403
          ) {
            debounceErrorMessage(err.response.data.data);
          }
        } else {
          debounceSuccessMessage("Gagal Menambahkan Stasiun");
        }
        console.error(err);
      });
  };

  const handleDeleteStation = (station_index: number) => {
    httpRequest
      .delete(`/stations/${stationsData[station_index].key}`)
      .then((response) => {
        debounceSuccessMessage("Berhasil Menghapus Stasiun");
        setPageFilter({ ...pageFilter });
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
        } else {
          debounceErrorMessage("Gagal Menghapus Stasiun");
        }
        console.error(err);
      });
  };

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    form.setFieldValue("key", tokenizeString(e.target.value, true));
  };
  //#endregion ::: Handlers

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

  const RenderActionButtons = (
    value: any,
    record: any,
    index: number
  ): React.ReactNode => {
    return (
      <div className="flex flex-wrap justify-center gap-1">
        <span
          className="rounded-lg bg-amber-100 p-2 text-amber-700 transition-all duration-300 hover:cursor-pointer hover:bg-amber-200"
          onClick={() => {
            form.setFieldValue(
              "key",
              tokenizeString(record.name !== undefined ? record.name : "", true)
            );
            form.setFieldValue("station_name", record.name);
            setModalOpen(!isModalOpen);
            setModalIndex(index);
            setModalType("edit");
          }}
        >
          <FontAwesomeIcon className="h-[16px]" icon={faPen} />
        </span>
        <Popconfirm
          title="Yakin hapus stasiun ini?"
          onConfirm={() => {
            handleDeleteStation(index);
          }}
          okText="Ya"
          cancelText="Tidak"
        >
          <span className="rounded-lg bg-red-100 p-2 text-red-700 transition-all duration-300 hover:cursor-pointer hover:bg-red-200">
            <FontAwesomeIcon className="h-[16px]" icon={faTrash} />
          </span>
        </Popconfirm>
      </div>
    );
  };
  //#endregion ::: Renderers

  //

  //#region ::: Other Methods
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchStations = React.useCallback(
    debounce(() => {
      httpRequest
        .get(`/stations`, queryParams)
        .then((response) => {
          const result: Station[] = response.data.data;
          const metadata: any = response.data.metadata;

          setStationsData(result);
          setMetadata(metadata);
          setIsReloading(false);
        })
        .catch((err) => {
          if (
            err?.response?.data?.data !== undefined &&
            err.response !== null
          ) {
            if (
              err.response.data.status !== 401 &&
              err.response.data.status !== 403
            ) {
              debounceErrorMessage(err.response.data.data);
            }
          }
          console.error(err);
        });
    }, 200),
    [pageFilter]
  );
  //#endregion ::: Other Methods

  //

  //#region ::: Form Columns
  const columns: ColumnsType<Station> = [
    { title: "ID", dataIndex: "key", key: "key" },
    { title: "Nama", dataIndex: "name", key: "name" },
    {
      title: "Dibuat",
      dataIndex: "created_at",
      key: "created_at",
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
    fetchStations();
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
        <title>Manajemen Stasiun | KPID Jawa Timur</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1 className="mb-4 text-xl font-semibold md:text-2xl">Daftar Stasiun</h1>
      <section className="mb-4 rounded-lg bg-white p-4 shadow-custom md:p-4">
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
              <Button
                type="primary"
                onClick={() => {
                  setModalType("add");
                  setModalOpen(true);
                }}
              >
                Tambah Stasiun
              </Button>
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
          <div className="mb-2 flex justify-between">
            {RenderFilterBody()}
            <div className="flex flex-col justify-end">
              <Button
                type="primary"
                onClick={() => {
                  setModalType("add");
                  setModalOpen(true);
                }}
              >
                Tambah Stasiun
              </Button>
            </div>
          </div>
        )}
        <Spin spinning={isReloading}>
          <Table
            columns={columns}
            dataSource={stationsData}
            pagination={false}
          />
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
          modalType === "edit" ? "Ubah Data Stasiun" : "Tambah Data Stasiun"
        }
        open={isModalOpen}
        onCancel={() => {
          setModalOpen(false);
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
            label="ID"
            name="key"
            rules={[
              { required: true, message: "Konversi dari nama ke ID error" },
            ]}
          >
            <Input disabled className="bg-slate-50" />
          </Form.Item>

          <Form.Item
            label="Nama Stasiun"
            name="station_name"
            rules={[
              { required: true, message: "Silakan masukkan nama stasiun" },
            ]}
          >
            <Input onChange={debounce(handleChangeInput, 200)} />
          </Form.Item>

          <Form.Item>
            <div className="flex justify-end gap-4">
              <Button
                onClick={() => {
                  setModalOpen(false);
                }}
              >
                Batal
              </Button>
              <Popconfirm
                title={
                  modalType === "edit"
                    ? "Yakin ubah stasiun ini?"
                    : "Yakin tambah stasiun ini?"
                }
                onConfirm={
                  modalType === "edit" ? handleEditStation : handleAddStation
                }
                okText="Ya"
                cancelText="Tidak"
              >
                <Button type="primary">
                  {modalType === "edit" ? "Ubah" : "Tambah"}
                </Button>
              </Popconfirm>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ManageStation;

ManageStation.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};
