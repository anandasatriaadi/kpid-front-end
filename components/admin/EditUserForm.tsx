import httpRequest from "@/common/HttpRequest";
import { AuthContext, AuthContextInterface } from "@/context/AuthContext";
import UserData from "@/types/UserData";
import { Button, Form, Input, message, Popconfirm } from "antd";
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

function EditUserForm({
  form,
  usersData,
  userIndex,
  pageFilter,
  setPageFilter,
  setIsModalOpen,
  setIsReloading,
}: FormProps) {
  //#region ::: Variable Initialisations
  const [confirmDirty, setConfirmDirty] = React.useState(false);
  const { userData, logout } = React.useContext(
    AuthContext
  ) as AuthContextInterface;

  //#endregion ::: Variable Initialisations

  //

  //#region ::: Handlers
  const onFinishEditUser = async (values: { [key: string]: any }) => {
    let temp_values = { ...values, user_id: usersData[userIndex]._id };
    httpRequest
      .put(`/users`, temp_values)
      .then((response) => {
        message.success("Berhasil mengubah pengguna");
        setPageFilter({ ...pageFilter });
        setIsModalOpen(false);
        setIsReloading(true);
        form.resetFields();
        usersData[userIndex]._id === userData?._id ? logout() : null;
      })
      .catch((err) => {
        if (err.response !== null && err?.response?.data?.data !== undefined) {
          message.error(err.response.data.data);
        }
        console.error(err);
      });
  };

  const validatePassword = (_: any, value: any, callback: any) => {
    const { validateFields } = form;

    if (value && confirmDirty) {
      validateFields(["confirmPassword"]);
    }
    callback();
  };

  const compareToFirstPassword = (_: any, value: any, callback: any) => {
    const { getFieldValue } = form;

    if (value && value !== getFieldValue("password")) {
      callback("Kata sandi tidak cocok!");
    } else {
      callback();
    }
  };

  const handleConfirmBlur = (e: any) => {
    const { value } = e.target;
    setConfirmDirty(confirmDirty || !!value);
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
      onFinish={onFinishEditUser}
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

      <Form.Item
        label="Password Lama"
        name="old_password"
        rules={[
          {
            required: false,
            message: "Silakan masukkan kata sandi lama Anda",
          },
          {
            pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
            message:
              "Kata sandi harus terdiri dari minimal 8 karakter dan mengandung kombinasi huruf dan angka.",
          },
        ]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        label="Password"
        name="password"
        rules={[
          {
            required: false,
            message: "Silakan masukkan kata sandi Anda",
          },
          {
            pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
            message:
              "Kata sandi harus terdiri dari minimal 8 karakter dan mengandung kombinasi huruf dan angka.",
          },
        ]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        label="Konfirmasi Password"
        name="confirm_password"
        dependencies={["password"]}
        rules={[
          {
            required: false,
            message: "Silakan konfirmasi kata sandi Anda",
          },
          // { validator: compareToFirstPassword },
        ]}
      >
        <Input.Password onBlur={handleConfirmBlur} />
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
          <Popconfirm
            title="Yakin ubah pengguna ini?"
            onConfirm={() => {
              form.submit();
            }}
            okText="Ya"
            cancelText="Tidak"
          >
            <Button type="primary">Ubah Data</Button>
          </Popconfirm>
        </div>
      </Form.Item>
    </Form>
  );
}

export default EditUserForm;
