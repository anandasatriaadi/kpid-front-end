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

export const debounceSuccessMessage = debounce((msg: string) => {
  message.success(msg);
}, 150);

export const debounceErrorMessage = debounce((msg: string) => {
  message.error(msg);
}, 150);

export const debounceLoadingMessage = debounce((msg: string) => {
  message.loading(msg);
}, 150);

export const debounceWarningMessage = debounce((msg: string) => {
  message.warning(msg);
}, 150);
