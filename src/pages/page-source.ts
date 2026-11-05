import type { Page } from '@playwright/test';

/**
 * Всё, что содержит авторизованную страницу: сессия фикстуры
 * (CreatedApprover, RoleSession и т.п.).
 */
export interface WithPage {
  page: Page;
}

/**
 * Источник страницы для фабрик page-объектов: сама страница или сессия фикстуры.
 *
 * Позволяет одинаково вызывать фабрику из тестов и из фикстур:
 * `createReportCardPage(privileged)` и `createReportCardPage(authenticatedPage)`.
 */
export type PageSource = Page | WithPage;

/**
 * Достаёт Playwright-страницу из сессии фикстуры или из самого Page.
 *
 * У `Page` нет свойства `page`, поэтому проверка `'page' in source`
 * однозначно различает два варианта.
 */
export const resolvePage = (source: PageSource): Page => ('page' in source ? source.page : source);
