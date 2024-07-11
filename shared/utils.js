export function roundToDecimals(value, decimals) {
  if (typeof decimals !== "number") {
    throw new Error("Decimals value is invalid; must be a number.");
  }
  const factor = Math.pow(10, decimals)
  return Math.round(value * factor) / factor;
}

export function join(a, ...b) {
  for (const arr of b) {
    a.push.apply(a, arr);
  }
  return a;
}

export function sortByProp(arr, prop) {
  return arr.sort((a, b) => a[prop] - b[prop]);
}
