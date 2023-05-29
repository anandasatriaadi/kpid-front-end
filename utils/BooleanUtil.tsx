export function isEmpty(value?: any) {
  return (
    value === "" ||
    (Array.isArray(value) && value.length === 0) ||
    (value !== undefined && value !== null && Object.keys(value).length === 0)
  );
}

export function isNil(value?: any) {
  return value === undefined || value === null;
}

export function isNilOrEmpty(value?: any) {
  return isNil(value) || isEmpty(value);
}
