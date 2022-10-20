import { Button, Collapse, Divider, Empty, Skeleton, Timeline } from "antd";
import React, { useState } from "react";

function ResultCard() {
  const [loaded, setLoaded] = useState<boolean>(false);
  const onChange = (key: string | string[]) => {
    if (!loaded) {
      setTimeout(() => {
        setLoaded(true);
      }, 2000);
    }
    console.log(key);
  };
  return (
    <div className="mt-4 p-4 rounded-md shadow-lg border-2 border-gray-100">
      <h4 className="font-semibold">RCTI_1300-1400_Sinetron.mp4</h4>
      <div className="flex mt-2 text-center">
        <div className="flex flex-col items-center pl-0 pr-2 border-r-2 border-gray-100 last:border-0">
          <p className="text-sm text-gray-500">Jam Mulai</p>
          <p className="font-semibold">13:00:00</p>
        </div>
        <div className="flex flex-col items-center pl-2 pr-2 border-r-2 border-gray-100 last:border-0">
          <p className="text-sm text-gray-500">Jam Selesai</p>
          <p className="font-semibold">14:00:00</p>
        </div>
        <div className="flex flex-col items-center pl-2 pr-2 border-r-2 border-gray-100 last:border-0">
          <p className="text-sm text-gray-500">Durasi</p>
          <p className="font-semibold">3600 detik</p>
        </div>
        <div className="flex flex-col items-center pl-2 pr-2 border-r-2 border-gray-100 last:border-0">
          <p className="text-sm text-gray-500">FPS</p>
          <p className="font-semibold">30</p>
        </div>
        <div className="flex flex-col items-center pl-2 pr-0 border-r-2 border-gray-100 last:border-0">
          <p className="text-sm text-gray-500">Konten Terdeteksi</p>
          <p className="font-semibold">2</p>
        </div>
      </div>
      <div className="mt-4">
        <Collapse onChange={onChange}>
          <Collapse.Panel header="Lihat Detail" key="1">
            {loaded ? (
              <Timeline>
                <Timeline.Item>
                  <p className="">Detik 376 | 13:06:16</p>
                  <div className="flex flex-col sm:flex-row mt-2">
                    <div className="sm:flex-1">
                      <div className="pt-[52%] bg-gray-100"></div>
                    </div>
                    <div className="sm:flex-1 lg:flex-[2] sm:ml-4 mt-2 sm:mt-0 mb-4 sm:mb-0">
                      <h3 className="font-semibold">Dugaan Pelanggaran</h3>
                      <ol className="list-decimal list-inside">
                        <li className="font-semibold mt-2">
                          UU. XX Pasal XX BAB XX Tahun 2012
                          <br />
                          <p className="font-normal">
                            Lorem ipsum dolor sit, amet consectetur adipisicing
                            elit. Voluptates sapiente laboriosam qui quisquam
                            animi nemo cumque velit, quia totam culpa.
                          </p>
                        </li>
                        <li className="font-semibold mt-2">
                          UU. XX Pasal XX BAB XX Tahun 2012
                          <br />
                          <p className="font-normal">
                            Lorem ipsum dolor sit, amet consectetur adipisicing
                            elit. Voluptates sapiente laboriosam qui quisquam
                            animi nemo cumque velit, quia totam culpa.
                          </p>
                        </li>
                      </ol>
                    </div>
                  </div>
                  <Divider className="my-4"></Divider>
                  <div className="flex justify-end mt-2">
                    <div className="">
                      <Button type="primary" className="button-green mr-4">
                        Valid
                      </Button>
                      <Button type="primary" danger>
                        Invalid
                      </Button>
                    </div>
                  </div>
                </Timeline.Item>

                <Timeline.Item>
                  <p className="">Detik 1526 | 13:25:26</p>
                  <div className="flex flex-col sm:flex-row mt-2">
                    <div className="sm:flex-1">
                      <div className="pt-[52%] bg-gray-100"></div>
                    </div>
                    <div className="sm:flex-1 lg:flex-[2] sm:ml-4 mt-2 sm:mt-0 mb-4 sm:mb-0">
                      <h3 className="font-semibold">Dugaan Pelanggaran</h3>
                      <ol className="list-decimal list-inside">
                        <li className="font-semibold mt-2">
                          UU. XX Pasal XX BAB XX Tahun 2012
                          <br />
                          <p className="font-normal">
                            Lorem ipsum dolor sit, amet consectetur adipisicing
                            elit. Voluptates sapiente laboriosam qui quisquam
                            animi nemo cumque velit, quia totam culpa.
                          </p>
                        </li>
                        <li className="font-semibold mt-2">
                          UU. XX Pasal XX BAB XX Tahun 2012
                          <br />
                          <p className="font-normal">
                            Lorem ipsum dolor sit, amet consectetur adipisicing
                            elit. Voluptates sapiente laboriosam qui quisquam
                            animi nemo cumque velit, quia totam culpa.
                          </p>
                        </li>
                      </ol>
                    </div>
                  </div>
                  <Divider className="my-4"></Divider>
                  <div className="flex justify-end mt-2">
                    <div className="">
                      <Button type="primary" className="button-green mr-4">
                        Valid
                      </Button>
                      <Button type="primary" danger>
                        Invalid
                      </Button>
                    </div>
                  </div>
                </Timeline.Item>
                <Timeline.Item>
                  <p className="">Detik 2324 | 13:38:44</p>
                  <div className="flex flex-col sm:flex-row mt-2">
                    <div className="sm:flex-1">
                      <div className="pt-[52%] bg-gray-100"></div>
                    </div>
                    <div className="sm:flex-1 lg:flex-[2] sm:ml-4 mt-2 sm:mt-0 mb-4 sm:mb-0">
                      <h3 className="font-semibold">Dugaan Pelanggaran</h3>
                      <ol className="list-decimal list-inside">
                        <li className="font-semibold mt-2">
                          UU. XX Pasal XX BAB XX Tahun 2012
                          <br />
                          <p className="font-normal">
                            Lorem ipsum dolor sit, amet consectetur adipisicing
                            elit. Voluptates sapiente laboriosam qui quisquam
                            animi nemo cumque velit, quia totam culpa.
                          </p>
                        </li>
                        <li className="font-semibold mt-2">
                          UU. XX Pasal XX BAB XX Tahun 2012
                          <br />
                          <p className="font-normal">
                            Lorem ipsum dolor sit, amet consectetur adipisicing
                            elit. Voluptates sapiente laboriosam qui quisquam
                            animi nemo cumque velit, quia totam culpa.
                          </p>
                        </li>
                      </ol>
                    </div>
                  </div>
                  <Divider className="my-4"></Divider>
                  <div className="flex justify-end mt-2">
                    <div className="">
                      <Button type="primary" className="button-green mr-4">
                        Valid
                      </Button>
                      <Button type="primary" danger>
                        Invalid
                      </Button>
                    </div>
                  </div>
                </Timeline.Item>
              </Timeline>
            ) : (
              <Skeleton active />
            )}
          </Collapse.Panel>
        </Collapse>
      </div>
    </div>
  );
}

export default ResultCard;
