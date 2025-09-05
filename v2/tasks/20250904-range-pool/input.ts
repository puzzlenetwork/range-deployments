import { Task, TaskMode } from '@src';

export type RangePoolDeployment = {
  RangePoolFactory: string;
  Vault: string;
  ProtocolFeePercentagesProvider: string;
  LID: string;
  VOV: string;
};

const RangePoolFactory = new Task('20250901-range-pool-factory', TaskMode.READ_ONLY);
const Vault = new Task('20210418-vault', TaskMode.READ_ONLY);
const ProtocolFeePercentagesProvider = new Task('20220725-protocol-fee-percentages-provider', TaskMode.READ_ONLY);
const LID = new Task('00000000-tokens', TaskMode.READ_ONLY);
const VOV = new Task('00000000-tokens', TaskMode.READ_ONLY);

export default {
  RangePoolFactory,
  Vault,
  ProtocolFeePercentagesProvider,
  LID,
  VOV,
};
