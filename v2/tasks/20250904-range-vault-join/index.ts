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
  // use userInit for the first join
  const userDataInit = "0x0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000c00000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000002386f26fc10000000000000000000000000000000000000000000000000000002386f26fc100000000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000004686f26fc10000000000000000000000000000000000000000000000000000004686f26fc10000";
  const userDataThen = "0x000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000002386f26fc10000000000000000000000000000000000000000000000000000002386f26fc10000";

  const request = {
    assets: [input.LID, input.VOV],
    maxAmountsIn: [fp(1),fp(1)],
    userData: userDataThen,
    fromInternalBalance: false,
  }

  const vaultJoinReceipt = await (
    await vault.connect(signer).joinPool(
      poolId,
      signer.address,
      signer.address,
      request
    )
  ).wait();
  expectEvent.inReceipt(vaultJoinReceipt, 'PoolBalanceChanged');
};
