import { configs } from "../types/index.js";

const userConfigs: configs[] = [
  {
    paid: false,
    concurent: 50,
    totalPerTest: 5000,
    testPerHour: 5,
  },
  {
    paid: true,
    concurent: 500,
    totalPerTest: 50000,
    testPerHour: 50,
  },
];

export default userConfigs;
