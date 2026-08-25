import { Page } from '@playwright/test';
import { createHeaderLocators } from './header.locators';

export const createLkPageLocators = (page: Page) => ({
  // Шапка общая с остальными внутренними страницами
  ...createHeaderLocators(page),

  tabButtons: {
    generalInfo: page.getByRole('button', { name: 'Общая информация' }),
    projectHistory: page.getByRole('button', { name: 'История проектов' }),
    certification: page.getByRole('button', { name: 'Аттестация' }),
    extraEducation: page.getByRole('button', { name: 'Доп. образование' }),
    settings: page.getByRole('button', { name: 'Настройки' }),
  },

  generalInfoLabels: {
    fullName: page.getByText('ФИО', { exact: true }),
    birthDate: page.getByText('Дата рождения', { exact: true }),
    position: page.getByText('Должность(-и)', { exact: true }),
    email: page.getByText('E-mail', { exact: true }),
  },

  emptyProjectHistory: page.getByText('Вы пока не участвовали ни в одном проекте'),

  settingsSection: {
    changePhotoButton: page.getByText('Изменить фото').first(),
    changePasswordButton: page.getByText('Изменить пароль').first(),
  },
});

export type LkPageLocators = ReturnType<typeof createLkPageLocators>;
