import { randomBytes } from 'node:crypto';
import { WorkData } from '../types';
import { addMonths, formatDmy, today } from '../utils/date';

const randomToken = (): string => randomBytes(4).toString('hex');

/** Базовая фабрика работы: уникальное имя + даты в пределах мегапроекта (по умолчанию сегодня .. +1 мес). */
export const createWork = (overrides: Partial<WorkData> = {}): WorkData => ({
  name: `РАБОТА-${Date.now()}-${randomToken()}`,
  direction: 'Супервайзинг',
  startDate: formatDmy(today()),
  stopDate: formatDmy(addMonths(today(), 1)),
  temporaryPersonal: '10',
  workShift: '1',
  ...overrides,
});

export const workFactory = {
  standard: (overrides: Partial<WorkData> = {}) => createWork(overrides),
  //TODO добавить работы всех видов (супервайзинг, врезки, утечки, комплекс)
};
