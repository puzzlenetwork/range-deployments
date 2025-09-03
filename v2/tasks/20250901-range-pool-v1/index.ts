import { ZERO_ADDRESS, ZERO_BYTES32 } from '@helpers/constants';
import { bn, fp } from '@helpers/numbers';
import * as expectEvent from '@helpers/expectEvent';

import { getContractDeploymentTransactionHash, saveContractDeploymentTransactionHash } from '@src';

import { Task, TaskRunOptions, getSigner } from '@src';
import { RangePoolDeployment } from './input';

export default async (task: Task, { force, from }: TaskRunOptions = {}): Promise<void> => {
  const input = task.input() as RangePoolDeployment;

  const args = [input.Vault, input.ProtocolFeePercentagesProvider, 0, 0];
  // Comment next line after factory deployment and run verification again
  const factory = await task.deployAndVerify('RangePoolFactory', args, from, force);
  //const factory = await task.instanceAt('RangePoolFactory', task.output()['RangePoolFactory']);

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

  // this block for optional pool creation
  /*const poolCreationReceipt = await (
    await factory.connect(signer).create(
      newRangePoolParams.name,
      newRangePoolParams.symbol,
      newRangePoolParams.tokens,
      newRangePoolParams.normalizedWeights,
      newRangePoolParams.virtualBalances,
      newRangePoolParams.rateProviders,
      newRangePoolParams.swapFeePercentage,
      signer.address,
      ZERO_BYTES32
    )
  ).wait();
  const event = expectEvent.inReceipt(poolCreationReceipt, 'PoolCreated');
  const mockPoolAddress = event.args.pool;

  await saveContractDeploymentTransactionHash(mockPoolAddress, poolCreationReceipt.transactionHash, task.network);
  await task.save({ MockRangePool: mockPoolAddress });*/

  const mockPool = await task.instanceAt('RangePool', task.output()['MockRangePool']);

  const { paused, pauseWindowEndTime, bufferPeriodEndTime } = await mockPool.getPausedState();

  const mockPoolArgs = {
    params: newRangePoolParams,
    vault: input.Vault,
    protocolFeeProvider: input.ProtocolFeePercentagesProvider,
    pauseWindowDuration: pauseWindowEndTime,
    bufferPeriodDuration: bufferPeriodEndTime,
    owner: ZERO_ADDRESS,
  };

  await task.verify('RangePool', mockPool.address, [
    mockPoolArgs.params,
    mockPoolArgs.vault,
    mockPoolArgs.protocolFeeProvider,
    mockPoolArgs.pauseWindowDuration,
    mockPoolArgs.bufferPeriodDuration,
    mockPoolArgs.owner,
  ]);
};
