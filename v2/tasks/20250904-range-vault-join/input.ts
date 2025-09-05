import { Task, TaskMode } from '@src';

export type RangePoolDeployment = {
  RangePool: string;
  Vault: string;
  LID: string;
  VOV: string;
};

const RangePool = new Task('20250904-range-pool', TaskMode.READ_ONLY);
const Vault = new Task('20210418-vault', TaskMode.READ_ONLY);
const LID = new Task('00000000-tokens', TaskMode.READ_ONLY);
const VOV = new Task('00000000-tokens', TaskMode.READ_ONLY);

export default {
  RangePool,
  Vault,
  LID,
  VOV,
};
