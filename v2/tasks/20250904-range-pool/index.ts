import { ZERO_ADDRESS, ZERO_BYTES32 } from '@helpers/constants';
import { bn, fp } from '@helpers/numbers';
import * as expectEvent from '@helpers/expectEvent';

import { saveContractDeploymentTransactionHash } from '@src';

import { Task, TaskRunOptions, getSigner } from '@src';
import { RangePoolDeployment } from './input';

export default async (task: Task, { force, from }: TaskRunOptions = {}): Promise<void> => {
  const input = task.input() as RangePoolDeployment;

  const factory = await task.instanceAt('RangePoolFactory', input.RangePoolFactory);

  const newRangePoolParams = {
    name: 'LID/VOV',
    symbol: 'LDV',
    tokens: [input.LID, input.VOV].sort(function (a, b) {
      return a.toLowerCase().localeCompare(b.toLowerCase());
    }),
    normalizedWeights: [fp(0.5), fp(0.5)],
    virtualBalances: [0, 0],
    rateProviders: [ZERO_ADDRESS, ZERO_ADDRESS],
    assetManagers: [ZERO_ADDRESS, ZERO_ADDRESS],
    swapFeePercentage: bn(1e12),
  };

  const signer = from ?? (await getSigner());

  const poolCreationReceipt = await (
    await factory.connect(signer).create(
      newRangePoolParams.name,
      newRangePoolParams.symbol,
      newRangePoolParams.tokens,
      newRangePoolParams.normalizedWeights,
      newRangePoolParams.virtualBalances,
      newRangePoolParams.rateProviders,
      newRangePoolParams.swapFeePercentage,
      signer.address,
      "0xfb61e42f07c6c93c5c8ec9f6c6861bed2208bfa0d85a028822656e93bdc7dd9d" // change the salt every time for a new pool deployment
    )
  ).wait();
  const event = expectEvent.inReceipt(poolCreationReceipt, 'PoolCreated');
  const poolAddress = event.args.pool;

  await saveContractDeploymentTransactionHash(poolAddress, poolCreationReceipt.transactionHash, task.network);
  await task.save({ RangePool: poolAddress });

  const pool = await task.instanceAt('RangePool', task.output()['RangePool']);

  const { paused, pauseWindowEndTime, bufferPeriodEndTime } = await pool.getPausedState();

  const poolArgs = {
    params: newRangePoolParams,
    vault: input.Vault,
    protocolFeeProvider: input.ProtocolFeePercentagesProvider,
    pauseWindowDuration: pauseWindowEndTime,
    bufferPeriodDuration: bufferPeriodEndTime,
    owner: ZERO_ADDRESS,
  };

  await task.verify('RangePool', pool.address, [
    poolArgs.params,
    poolArgs.vault,
    poolArgs.protocolFeeProvider,
    poolArgs.pauseWindowDuration,
    poolArgs.bufferPeriodDuration,
    poolArgs.owner,
  ]);
};
