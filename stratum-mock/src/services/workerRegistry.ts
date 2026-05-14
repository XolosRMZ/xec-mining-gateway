import { WorkerRecord } from "../types";

const workers = new Map<string, WorkerRecord>();

export const registerWorker = (
  workerName: string,
  wallet: string,
  plan: string,
): WorkerRecord => {
  const record: WorkerRecord = {
    workerName,
    wallet,
    plan,
    connectedAt: new Date().toISOString(),
    authorized: true,
  };

  workers.set(workerName, record);

  return record;
};

export const getWorker = (workerName: string): WorkerRecord | undefined =>
  workers.get(workerName);

export const listWorkers = (): WorkerRecord[] => Array.from(workers.values());
