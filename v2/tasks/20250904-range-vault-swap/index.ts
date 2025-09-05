import { ZERO_ADDRESS, ZERO_BYTES32 } from '@helpers/constants';
import { bn, fp } from '@helpers/numbers';
import * as expectEvent from '@helpers/expectEvent';

import { Task, TaskRunOptions, getSigner } from '@src';
import { RangePoolDeployment } from './input';

export default async (task: Task, { force, from }: TaskRunOptions = {}): Promise<void> => {
  const input = task.input() as RangePoolDeployment;

  const pool = await task.instanceAt('RangePool', input.RangePool);
  const poolId = await pool.getPoolId();
  const vault = await task.instanceAt('Vault', input.Vault);

  const signer = from ?? (await getSigner());

  const singleSwap = {
    poolId: poolId,
    kind: 0,
    assetIn: input.LID,
    assetOut: input.VOV,
    amount: fp(0.000001),
    userData: "0x",
    sender: signer.address,
    fromInternalBalance: false,
  };

  const funds = {
    sender: signer.address,
    fromInternalBalance: false,
    recipient: signer.address,
    toInternalBalance: false,
  };

  const limit = fp(0.0000001);
  const deadline = 1856896104;

  const vaultSwapReceipt = await (
    await vault.connect(signer).swap(
      singleSwap,
      funds,
      limit,
      deadline,
    )
  ).wait();
  expectEvent.inReceipt(vaultSwapReceipt, 'Swap');
};
