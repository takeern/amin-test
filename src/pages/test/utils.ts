const QILIN_ADMIN_CONTRACT_HISTORY_KEY = 'QILIN_ADMIN_CONTRACT_HISTORY_KEY';

export const setContractList = (item: any) => {
  const arr: any[] = getContractList();
  arr.unshift(item);
  localStorage.setItem(QILIN_ADMIN_CONTRACT_HISTORY_KEY, JSON.stringify(arr));
}

export const getContractList = () => {
  const str = localStorage.getItem(QILIN_ADMIN_CONTRACT_HISTORY_KEY);
  let arr = [];
  if (str) {
    arr = JSON.parse(str);
  }

  return arr;
}