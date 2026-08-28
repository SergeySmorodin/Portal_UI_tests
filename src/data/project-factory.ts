import { randomBytes } from 'node:crypto';
import { ProjectData } from '../types';
import { addMonths, formatDmy, today } from '../utils/date';

const randomToken = (): string => randomBytes(4).toString('hex');

export const createProject = (overrides: Partial<ProjectData> = {}): ProjectData => ({
  code: `ТЕСТ-${Date.now()}-${randomToken()}`,
  status: 'Черновик',
  startDate: formatDmy(today()),
  stopDate: formatDmy(addMonths(today(), 3)),
  groupProject: '',
  typeProject: '',
  departmentProject: '',
  kindProject: '',
  note: `Автотест ${randomToken()}`,
  ...overrides,
});

export const projectFactory = {
  draft: (overrides: Partial<ProjectData> = {}) =>
    createProject({ status: 'Черновик', ...overrides }),

  active: (overrides: Partial<ProjectData> = {}) =>
    createProject({ status: 'Действующий', ...overrides }),
};
