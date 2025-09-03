import { Task, TaskMode } from '@src';

export type RangePoolDeployment = {
  Vault: string;
  ProtocolFeePercentagesProvider: string;
  FactoryVersion: string;
  PoolVersion: string;
  LID: string;
  VOV: string;
};

const Vault = new Task('20210418-vault', TaskMode.READ_ONLY);
const ProtocolFeePercentagesProvider = new Task('20220725-protocol-fee-percentages-provider', TaskMode.READ_ONLY);
const LID = new Task('00000000-tokens', TaskMode.READ_ONLY);
const VOV = new Task('00000000-tokens', TaskMode.READ_ONLY);

const BaseVersion = { version: 4, deployment: '20250901-range-pool-v1' };

export default {
  Vault,
  ProtocolFeePercentagesProvider,
  LID,
  VOV,
  FactoryVersion: JSON.stringify({ name: 'RangePoolFactory', ...BaseVersion }),
  PoolVersion: JSON.stringify({ name: 'RangePool', ...BaseVersion }),
};
