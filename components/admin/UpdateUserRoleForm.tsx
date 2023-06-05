import httpRequest from "@/common/HttpRequest";
import { AuthContext, AuthContextInterface } from "@/context/AuthContext";
import UserData from "@/types/UserData";
import { debounceErrorMessage, debounceSuccessMessage } from "@/utils/Debounce";
import { Button, Form, Input, Popconfirm } from "antd";
import { FormInstance } from "antd/es/form/Form";
import * as React from "react";

type FormProps = {
  form: FormInstance<any>;
  usersData: UserData[];
  userIndex: number;
  pageFilter: any;
  setPageFilter: React.Dispatch<React.SetStateAction<any>>;
  setIsModalOpen: React.Dispatch<React.SetStateAction<any>>;
  setIsReloading: React.Dispatch<React.SetStateAction<any>>;
};

function UpdateUserRoleForm({
  form,
  usersData,
  userIndex,
  pageFilter,
  setPageFilter,
  setIsModalOpen,
  setIsReloading,
}: FormProps) {
  //#region ::: Variable Initialisations
  const { userData } = React.useContext(AuthContext) as AuthContextInterface;
  const [role, setRole] = React.useState("");
  //#endregion ::: Variable Initialisations

  //

  //#region ::: Handlers
  const onFinishUserRole = async (values: { [key: string]: any }) => {
    if (role === "") return;
    let temp_values = {
      ...values,
      role: role,
      user_id: usersData[userIndex]._id,
    };
    httpRequest
      .put(`/users/role`, temp_values)
      .then((response) => {
        debounceSuccessMessage("Berhasil Mengubah Peran Pengguna");
        setPageFilter({ ...pageFilter });
        setIsModalOpen(false);
        setIsReloading(true);
        form.resetFields();
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
  //#endregion ::: Other Methods

  //

  //#region ::: UseEffect
  //#endregion ::: UseEffect

  return (
    <Form
      name="update_user_form"
      form={form}
      onFinish={onFinishUserRole}
      onFinishFailed={(error) => console.log(error)}
      autoComplete="off"
      layout="vertical"
      requiredMark={"optional"}
    >
      <Form.Item
        label="Nama"
        name="name"
        rules={[{ required: true, message: "Silakan masukkan nama Anda" }]}
      >
        <Input disabled />
      </Form.Item>

      <Form.Item
        label="Email"
        name="email"
        rules={[
          { required: true, message: "Silakan masukkan email Anda" },
          { type: "email", message: "Alamat email tidak valid!" },
        ]}
      >
        <Input disabled />
      </Form.Item>

      <Form.Item>
        <div className="flex justify-end gap-4">
          <Button
            onClick={() => {
              setIsModalOpen(false);
            }}
          >
            Batal
          </Button>

          {usersData[userIndex]._id === userData?._id ? (
            <Popconfirm
              title={
                <div className="max-w-[48ch]">
                  <div className="font-semibold capitalize">
                    Yakin hapus akses admin anda?
                  </div>
                  Aksi ini tidak dapat diurungkan. Anda akan kehilangan akses
                  halaman admin
                </div>
              }
              onConfirm={() => {
                setRole("user");
                form.submit();
              }}
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
                  Aksi ini tidak dapat diurungkan. Pengguna harus mendeaktivasi
                  diri sendiri ketika sudah menjadi admin
                </div>
              }
              onConfirm={() => {
                setRole("admin");
                form.submit();
              }}
              okText="Ya"
              cancelText="Tidak"
            >
              <Button type="primary">Aktivasi Admin</Button>
            </Popconfirm>
          )}
        </div>
      </Form.Item>
    </Form>
  );
}

export default UpdateUserRoleForm;
