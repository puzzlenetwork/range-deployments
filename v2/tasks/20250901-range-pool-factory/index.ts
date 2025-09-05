import { Task, TaskRunOptions } from '@src';
import { RangePoolFactoryDeployment } from './input';

export default async (task: Task, { force, from }: TaskRunOptions = {}): Promise<void> => {
  const input = task.input() as RangePoolFactoryDeployment;
  const args = [input.Vault, input.ProtocolFeePercentagesProvider, 0, 0];
  await task.deployAndVerify('RangePoolFactory', args, from, force);
};