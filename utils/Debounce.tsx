import { message } from "antd";

export default function debounce(callback: Function, wait: number) {
  let timeoutId: any = null;
  return (...args: any[]) => {
    window.clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => {
      callback.apply(null, args);
    }, wait);
  };
}

export const debounceSuccessMessage = debounce((msg: string, key?: string) => {
  let config: any = {
    content: msg,
  };
  if (key !== undefined) config["key"] = key;
  console.log(config)

  message.success(config);
}, 150);

export const debounceErrorMessage = debounce((msg: string, key?: string) => {
  let config: any = {
    content: msg,
  };
  if (key !== undefined) config["key"] = key;
  console.log(config)

  message.error(config);
}, 150);

export const debounceLoadingMessage = debounce((msg: string, key?: string) => {
  let config: any = {
    content: msg,
  };
  if (key !== undefined) config["key"] = key;
  console.log(config)

  message.loading(config);
}, 150);

export const debounceWarningMessage = debounce((msg: string, key?: string) => {
  let config: any = {
    content: msg,
  };
  if (key !== undefined) config["key"] = key;
  console.log(config)

  message.warning(config);
}, 150);
