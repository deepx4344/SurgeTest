import { configs } from "../types/index.js";

const userConfigs: configs[] = [
  {
    paid: false,
    concurrent: 50,
    totalPerTest: 5000,
    testPerHour: 5,
  },
  {
    paid: true,
    concurrent: 500,
    totalPerTest: 50000,
    testPerHour: 50,
  },
];

export default userConfigs;
