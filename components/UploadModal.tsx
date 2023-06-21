import httpRequest from "@/common/HttpRequest";
import {
  ApplicationContext,
  ApplicationContextInterface,
} from "@/context/ApplicationContext";
import { AuthContext, AuthContextInterface } from "@/context/AuthContext";
import { isEmpty } from "@/utils/BooleanUtil";
import debounce, {
  debounceErrorMessage,
  debounceSuccessMessage,
} from "@/utils/Debounce";
import { faFileVideo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  AutoComplete,
  Button,
  Checkbox,
  DatePicker,
  Form,
  Input,
  Modal,
  Progress,
  Steps,
  Upload,
  UploadFile,
  UploadProps,
} from "antd";
import { RangePickerProps } from "antd/lib/date-picker";
import { RcFile } from "antd/lib/upload";
import Dragger from "antd/lib/upload/Dragger";
import { AxiosProgressEvent, AxiosRequestConfig } from "axios";
import moment from "moment";
import { useRouter } from "next/router";
import * as React from "react";

type UploadModalProps = {
  modalOpen: boolean;
  setModalOpen: (modalOpen: boolean) => void;
};

type SelectOption = {
  label: string;
  value: string;
};

function UploadModal({ modalOpen, setModalOpen }: UploadModalProps) {
  //#region ::: Variable Initialisations
  // Contexts
  const { isLoggedIn } = React.useContext(AuthContext) as AuthContextInterface;
  const { isMobile } = React.useContext(
    ApplicationContext
  ) as ApplicationContextInterface;

  // States
  const [isUploading, setIsUploading] = React.useState<boolean>(false);
  const [currentStep, setCurrentStep] = React.useState(0);
  const [uploadProgressPercent, setUploadProgressPercent] =
    React.useState<number>(0);
  const [uploadFile, setUploadFile] = React.useState<UploadFile>();
  const [resSelectOptions, setResSelectOptions] = React.useState<
    SelectOption[]
  >([]);
  const [modSelectOptions, setModSelectOptions] = React.useState<
    SelectOption[]
  >([]);

  // Others
  const [form] = Form.useForm();
  const router = useRouter();

  const disabledDate: RangePickerProps["disabledDate"] = (current) => {
    return current && current > moment().endOf("day");
  };

  // File Upload Props
  const fileDropProps: UploadProps = {
    name: "file",
    maxCount: 1,
    fileList: uploadFile ? [uploadFile] : [],
    beforeUpload: (file) => {
      if (isLoggedIn) {
        setUploadFile(file);
        return false;
      } else {
        debounceErrorMessage("Anda Harus Login Terlebih Dahulu");
        return false;
      }
    },
    onRemove: () => {
      form.resetFields();
      setUploadFile(undefined);
    },
  };
  //#endregion ::: Variable Initialisations

  //

  //#region ::: Handlers
  const handleUploadProgress = (progress: AxiosProgressEvent) => {
    const { loaded, total } = progress;

    if (total !== undefined) {
      setUploadProgressPercent(Math.floor((loaded * 100) / total));
    }
  };

  const handleForm = debounce((values: any) => {
    setIsUploading(true);
    let form = new FormData();
    for (const key in values) {
      form.append(key, values[key]);
    }

    form.append("video_file", uploadFile as RcFile);

    let formPostConfig: AxiosRequestConfig = {
      onUploadProgress: handleUploadProgress,
    };

    httpRequest
      .post("/moderations", form, formPostConfig)
      .then((response) => {
        const result = response.data;
        if (result.status == 200) {
          debounceSuccessMessage("Formulir Terunggah dengan ID " + result.data);
          if (router.pathname !== "/result") {
            router.replace("/result");
          } else {
            router.reload();
          }
          handleCloseModal();
          setIsUploading(false);
        } else {
          debounceErrorMessage(result.data);
        }
      })
      .catch((err) => {
        handleCloseModal();
        setIsUploading(false);
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
  }, 500);

  const handleFormFailed = (errorInfo: any) => {
    console.log("Failed: ", errorInfo);
  };

  const handleAutoSearch = debounce((value: string) => {
    setModSelectOptions(
      resSelectOptions.filter((optVal) => {
        return optVal.label.toLowerCase().includes(value.toLowerCase());
      })
    );
  }, 250);

  const handleCloseModal = () => {
    setModalOpen(false);
    setCurrentStep(0);
    setUploadProgressPercent(0);
    setUploadFile(undefined);
    form.resetFields();
  };
  //#endregion ::: Handlers

  //

  //#region ::: Other Methods
  //#endregion ::: Other Methods

  //

  //#region ::: UseEffect
  React.useEffect(() => {
    if (isLoggedIn) {
      httpRequest
        .get("/stations")
        .then((res) => {
          if (res === undefined || res === null) return;
          const result: any = res.data;
  
          const filteredData = result.data.map((station: any) => {
            return {
              label: station.name,
              value: station.name,
            };
          });
  
          setResSelectOptions(filteredData);
          setModSelectOptions(filteredData);
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
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalOpen]);
  //#endregion ::: UseEffect

  return (
    <Modal
      centered
      closable={!isUploading}
      maskClosable={!isUploading}
      open={modalOpen}
      onCancel={() => {
        isUploading
          ? debounceSuccessMessage("Sedang Mengunggah Video")
          : handleCloseModal();
      }}
      footer={null}
      className={"w-full max-w-[1000px] px-4 "}
    >
      <div className="md:p-6">
        <Steps
          current={currentStep}
          direction={isMobile ? "vertical" : "horizontal"}
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
              " mt-6 flex-1 rounded-xl shadow-custom transition-all hover:shadow-custom-lg"
            }
          >
            <Dragger
              {...fileDropProps}
              accept="video/*"
              disabled={!isLoggedIn}
              className={
                "flex h-80 items-center justify-center rounded-lg border-2 border-dashed border-gray-400 bg-transparent hover:border-sky-600"
              }
              onChange={(info) => {
                if (!isEmpty(info.fileList)) {
                  setCurrentStep(1);
                }
              }}
            >
              <div className="flex flex-col text-base md:text-lg">
                <div className="flex justify-center">
                  <div className="h-10 w-10">
                    <FontAwesomeIcon
                      icon={faFileVideo}
                      className="h-10 w-10 text-sky-600"
                    />
                  </div>
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
            onFinish={handleForm}
            onFinishFailed={handleFormFailed}
            autoComplete="off"
            layout="vertical"
            className="custom-form pt-4"
            requiredMark={"optional"}
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
                  className="text-base font-normal md:text-lg"
                  disabled={currentStep === 2}
                  placeholder="Ketikkan Nama Program"
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
                <AutoComplete
                  className="min-w-[16ch] text-base font-normal md:text-lg"
                  popupClassName="rounded-lg"
                  placeholder="Ketikkan atau Pilih Stasiun Televisi"
                  options={modSelectOptions}
                  disabled={currentStep === 2}
                  onSearch={handleAutoSearch}
                />
              </Form.Item>
              <Form.Item label="Deskripsi" name="description">
                <Input.TextArea rows={4} disabled={currentStep === 2} />
              </Form.Item>
              <Form.Item
                className="my-4 text-lg"
                initialValue={""}
                label="Tanggal dan Waktu Rekaman"
                name="recording_date"
                rules={[
                  {
                    required: true,
                    message: "Masukkan tanggal dan waktu rekaman",
                  },
                ]}
              >
                <DatePicker
                  className="w-full text-base font-normal md:text-lg"
                  showTime={{
                    format: "HH:mm",
                    defaultValue: moment("00:00:00", "HH:mm:ss"),
                  }}
                  format="DD/MM/YYYY HH:mm"
                  disabledDate={disabledDate}
                  disabled={currentStep === 2}
                  placeholder="Pilih tanggal dan waktu rekaman diambil"
                ></DatePicker>
              </Form.Item>
              <Form.Item
                className="my-4"
                name="process_now"
                valuePropName="checked"
              >
                <Checkbox className="text-sm md:text-base" defaultChecked>
                  Proses Sekarang
                </Checkbox>
              </Form.Item>
            </div>

            {currentStep === 2 && uploadProgressPercent > 0 && (
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
              loading={isUploading}
            >
              Sebelumnya
            </Button>
            {currentStep === 2 ? (
              <Button
                className="text-base md:text-lg"
                type="primary"
                onClick={() => {
                  form.validateFields().then((_) => {
                    form.submit();
                  });
                }}
                loading={isUploading}
              >
                Unggah
              </Button>
            ) : (
              <Button
                className="text-base md:text-lg"
                type="primary"
                onClick={() => {
                  if (currentStep === 1)
                    form.validateFields().then((_) => {
                      setCurrentStep(currentStep + 1);
                    });
                  else setCurrentStep(currentStep + 1);
                }}
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
