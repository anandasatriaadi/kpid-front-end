import { faFileVideo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Button,
  Form,
  Input,
  message,
  Modal,
  Progress,
  Steps,
  TimePicker,
  Upload,
  UploadFile,
  UploadProps,
} from "antd";
import { RcFile } from "antd/lib/upload";
import Dragger from "antd/lib/upload/Dragger";
import { AxiosProgressEvent, AxiosRequestConfig } from "axios";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import httpRequest from "../common/HttpRequest";
import { AuthContext, AuthContextInterface } from "../context/AuthContext";
import {
  MobileContext,
  MobileContextInterface,
} from "../context/MobileContext";
import { isEmpty } from "../utils/CommonUtil";

type UploadModalProps = {
  modalOpen: boolean;
  setModalOpen: (modalOpen: boolean) => void;
};

function UploadModal(props: UploadModalProps) {
  const { modalOpen, setModalOpen } = props;
  const { isLoggedIn } = useContext(AuthContext) as AuthContextInterface;
  const { isMobile } = useContext(MobileContext) as MobileContextInterface;
  const [currentStep, setCurrentStep] = useState(0);
  const [uploadProgressPercent, setUploadProgressPercent] = useState<number>(0);
  const [uploadFile, setUploadFile] = useState<UploadFile>();
  const [form] = Form.useForm();
  const router = useRouter();

  const uploadProgressHandler = (progress: AxiosProgressEvent) => {
    const { loaded, total } = progress;

    if (total !== undefined) {
      setUploadProgressPercent(Math.floor((loaded * 100) / total));
    }
  };

  const onFinish = (values: any) => {
    let form = new FormData();
    for (const key in values) {
      form.append(key, values[key]);
    }

    form.append("video_file", uploadFile as RcFile);

    let formPostConfig: AxiosRequestConfig = {
      onUploadProgress: uploadProgressHandler,
    };

    httpRequest
      .post("/moderation-form", form, formPostConfig)
      .then((response) => {
        const result = response.data;
        if (result.status == 200) {
          message.success("Formulir terunggah dengan ID " + result.data);
          handleCloseModal();
        } else {
          message.error(result.data);
        }
      });
  };

  const onFinishFailed = (errorInfo: any) => {
    if (!isLoggedIn) {
      router.push("/login");
    }
    console.log("Failed: ", errorInfo);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setCurrentStep(0);
    setUploadProgressPercent(0);
    form.resetFields();
    setUploadFile(undefined);
  };

  const fileDropProps: UploadProps = {
    name: "file",
    maxCount: 1,
    beforeUpload: (file) => {
      if (isLoggedIn) {
        setUploadFile(file);
        return false;
      } else {
        message.error("Anda harus login terlebih dahulu");
        return false;
      }
    },
    onRemove: () => {
      form.resetFields();
      setUploadFile(undefined);
    },
    fileList: uploadFile ? [uploadFile] : [],
  };

  return (
    <Modal
      centered
      open={modalOpen}
      onCancel={() => handleCloseModal()}
      footer={null}
      className={isMobile ? "" : "min-w-[1000px]"}
    >
      <div className="md:p-6">
        <Steps
          current={currentStep}
          items={[
            {
              title: "Unggah Video",
              description: "",
            },
            {
              title: "Formulir Video",
              description: "Isi Detail Informasi Video",
            },
            {
              title: "Konfirmasi",
              description: "Konfirmasi Informasi Video",
            },
          ]}
        />
        {currentStep === 0 && (
          <div
            className={
              (isLoggedIn ? "bg-white" : "bg-slate-100") +
              " mt-6 flex-1 rounded-xl shadow-custom"
            }
          >
            <Dragger
              {...fileDropProps}
              accept="video/*"
              disabled={!isLoggedIn}
              className={
                "flex h-80 items-center justify-center rounded-md border-2 border-dashed border-gray-400 bg-transparent"
              }
              onChange={(info) => {
                if (!isEmpty(info.fileList)) {
                  setCurrentStep(1);
                }
              }}
            >
              <div className="flex flex-col text-base md:text-lg">
                <div className="flex justify-center">
                  <span>
                    <FontAwesomeIcon
                      icon={faFileVideo}
                      width={"36px"}
                      className={isLoggedIn ? "text-sky-500" : "text-gray-300"}
                    />
                  </span>
                </div>
                <div className="flex justify-center">
                  <Button
                    type="primary"
                    className="mt-2 flex items-center justify-center text-base md:text-lg"
                    disabled={!isLoggedIn}
                  >
                    Pilih Video
                  </Button>
                </div>
                <span className="mt-2 text-gray-900">
                  {isLoggedIn && !isMobile && (
                    <p>atau letakkan video anda disini</p>
                  )}
                </span>
              </div>
            </Dragger>
          </div>
        )}
        {currentStep >= 1 && (
          <Form
            form={form}
            name="moderation_form"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            layout="vertical"
            className="pt-4"
          >
            <div>
              <Upload {...fileDropProps} accept="video/*"></Upload>
              <Form.Item
                className="my-4 text-lg"
                initialValue={""}
                label="Nama Program"
                name="program_name"
                rules={[
                  {
                    required: true,
                    message: "Masukkan nama program",
                  },
                ]}
              >
                <Input
                  className="text-lg font-normal"
                  disabled={currentStep === 2}
                />
              </Form.Item>
              <Form.Item
                className="my-4 text-lg"
                initialValue={""}
                label="Stasiun Televisi"
                name="station_name"
                rules={[
                  {
                    required: true,
                    message: "Masukkan stasiun televisi",
                  },
                ]}
              >
                <Input
                  className="text-lg font-normal"
                  disabled={currentStep === 2}
                />
              </Form.Item>
              <Form.Item label="Deskripsi" name="description">
                <Input.TextArea rows={4} disabled={currentStep === 2} />
              </Form.Item>
              <Form.Item
                className="my-4 text-lg"
                initialValue={""}
                label="Waktu Mulai"
                name="start_time"
                rules={[
                  {
                    required: true,
                    message: "Masukkan waktu mulai",
                  },
                ]}
              >
                <TimePicker
                  className="w-full text-lg font-normal"
                  format={"HH:mm"}
                  disabled={currentStep === 2}
                ></TimePicker>
              </Form.Item>
            </div>

            {currentStep === 2 && (
              <div className="text-base text-slate-500">
                <h4>Upload Progress</h4>
                <Progress percent={uploadProgressPercent} />
              </div>
            )}
          </Form>
        )}
        {currentStep > 0 && (
          <div className="mt-8 flex justify-end gap-2">
            <Button
              className="text-lg"
              type="default"
              onClick={() => setCurrentStep(currentStep - 1)}
            >
              Sebelumnya
            </Button>
            {currentStep === 2 ? (
              <Button
                className="text-lg"
                type="primary"
                onClick={() => {
                  form.validateFields().then((values) => {
                    form.submit();
                  });
                }}
              >
                Unggah
              </Button>
            ) : (
              <Button
                className="text-lg"
                type="primary"
                onClick={() => setCurrentStep(currentStep + 1)}
              >
                Selanjutnya
              </Button>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
}

export default UploadModal;
