import { Page } from '@playwright/test';

export const createDistributionRequestsLocators = (page: Page) => {
  const modal = page
    .locator('div.bg-white.rounded-lg')
    .filter({ has: page.getByText(/Управление (заявками|демобилизацией)/) });

  return {
    // Страница выбора проекта (создание заявки на командировку)
    searchInput: page.getByPlaceholder('Название проекта...'),
    workButton: (name: string) => page.getByRole('button', { name }).first(),

    // Вкладки на странице работы
    visitsTab: page.getByRole('button', { name: /Визиты\(\d+\)/ }),
    requestsTab: page.getByRole('button', { name: /Заявки\(\d+\)/ }),
    createRequestButton: page.getByRole('button', { name: 'Создать заявку' }),
    correctionRequestButton: page.getByRole('button', { name: 'Корректировочная заявка' }),

    // Таблица поданных заявок на вкладке «Заявки»
    requestsTable: page
      .locator('table')
      .filter({ has: page.getByRole('columnheader', { name: 'ФИО создателя' }) }),
    requestsEmptyState: page.getByText('Нет поданных заявок'),
    viewRequestButton: page.getByTitle('Просмотр заявки'),
    editRequestButton: page.getByTitle('Редактировать заявку'),
    requestViewModal: page
      .locator('.fixed.inset-0')
      .filter({ has: page.getByText('Просмотр заявки', { exact: true }) })
      .last(),

    // Модал «Управление заявками» — шаг 1 (заявки)
    modal,

    requestHeaderDate: (label: string) =>
      modal.locator('label', { hasText: label }).locator('xpath=following-sibling::div[1]//input'),
    requestHeaderSelect: (label: string) =>
      modal.locator('label', { hasText: label }).locator('xpath=following-sibling::select[1]'),
    requestHeaderInput: (label: string) =>
      modal.locator('label', { hasText: label }).locator('xpath=following-sibling::input[1]'),

    nextButton: page.getByRole('button', { name: 'Далее' }),

    // Модал «Управление заявками» — шаг 2: массовое редактирование билетов (шапка)
    massEditDropdown: (label: string) =>
      modal
        .locator('label', { hasText: new RegExp(`^${label}$`) })
        .first()
        .locator('xpath=following-sibling::div[1]'),
    massEditDate: (label: string) =>
      modal
        .locator('label', { hasText: new RegExp(`^${label}$`) })
        .first()
        .locator('xpath=following-sibling::div[1]//input'),
    massEditSelect: (label: string) =>
      modal
        .locator('label', { hasText: new RegExp(`^${label}$`) })
        .first()
        .locator('xpath=following-sibling::select[1]'),

    // Поиск города в выпадающем списке
    citySearchInput: page.getByPlaceholder('Поиск города...').first(),
    cityOption: (name: string) => page.locator('div.p-4.cursor-pointer', { hasText: name }).first(),

    // Кнопка «Демобилизация» на странице визитов/заявок работы (активна после подачи заявки на командировку)
    demobilizationButton: page.getByRole('button', { name: 'Демобилизация' }),

    // Модал «Управление демобилизацией» — шаг 1 «Сотрудники»: таблица с чекбоксами
    selectAllVisitsCheckbox: modal.locator('thead input[type="checkbox"]'),
    /** Счётчик выбранных визитов «Выбрано визитов: N» (в шапке и футере модала). */
    selectedVisitsCount: modal.getByText(/^Выбрано визитов: \d+$/).first(),

    // Отметка визитов как «Местная командировка» (без билетов и суточных) на шаге «Заявки»
    visitLocalTripCheckboxes: modal.locator(
      'input[type="checkbox"][title*="Местная командировка"]'
    ),

    // Карточка визита в шаге 2 и её билеты
    visitCard: (index: number) => modal.locator('div.bg-white.rounded-lg.p-4').nth(index),
    visitCardAddTicket: (index: number) =>
      modal
        .locator('div.bg-white.rounded-lg.p-4')
        .nth(index)
        .getByRole('button', { name: '+ Добавить билет' }),

    // Кнопка «+ Добавить всем» — добавляет каждому сотруднику строку маршрута
    addTicketToAllButton: modal.getByRole('button', { name: '+ Добавить всем' }),

    submitForApprovalButton: page.getByRole('button', { name: 'Отправить на согласование' }),
  };
};

export type DistributionRequestsLocators = ReturnType<typeof createDistributionRequestsLocators>;
