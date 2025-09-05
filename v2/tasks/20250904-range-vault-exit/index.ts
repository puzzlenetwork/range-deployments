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
  const userData = "0x00000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000006d674ec8a0574";

  const request = {
    assets: [input.LID, input.VOV],
    minAmountsOut: [fp(0.0001),fp(0.0001)],
    userData: userData,
    toInternalBalance: false,
  }

  const vaultExitReceipt = await (
    await vault.connect(signer).exitPool(
      poolId,
      signer.address,
      signer.address,
      request
    )
  ).wait();
  expectEvent.inReceipt(vaultExitReceipt, 'PoolBalanceChanged');
};
