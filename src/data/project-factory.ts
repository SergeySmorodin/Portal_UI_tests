import { randomBytes } from 'node:crypto';
import { ProjectData } from '../types';

const randomToken = (): string => randomBytes(4).toString('hex');

const generateStartDate = (): string => {
  const now = new Date();
  const dd = String(now.getDate()).padStart(2, '0');
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const yyyy = now.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
};

const generateStopDate = (): string => {
  const now = new Date();
  now.setMonth(now.getMonth() + 3);
  const dd = String(now.getDate()).padStart(2, '0');
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const yyyy = now.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
};

export const createProject = (overrides: Partial<ProjectData> = {}): ProjectData => ({
  code: `ТЕСТ-${Date.now()}-${randomToken()}`,
  status: 'Черновик',
  startDate: generateStartDate(),
  stopDate: generateStopDate(),
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
