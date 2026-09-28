import type { APIRequestContext, Page } from '@playwright/test';
import { test, expect } from '../../fixtures/test-fixtures';
import type {
  CertificationDetailPage,
  CertificationSearchPage,
} from '../../pages/certification/certification-page';
import {
  createCertificationViaApi,
  findCertificationsByNameViaApi,
  getCertificationViaApi,
} from '../../test-data/api/certification-api';
import type { CertificationResourceType } from '../../test-data/api/api-handles';
import { certificationFactory } from '../../test-data/factory/certification-factory';
import type { CertificationData } from '../../types';
import { formatDotDmy, parseYmd } from '../../utils/date';

/** Подписи статуса документа в UI для значений select[name="status"]. */
const STATUS_LABELS: Record<string, string> = {
  active: 'Действующий',
  archive: 'Архив',
};

/** Заголовок типа документа на карточке для каждого resource_type. */
const DOCUMENT_TYPE_LABELS: Record<CertificationResourceType, string> = {
  certificate: 'Разрешительный документ (Сертификат/Декларация)',
  protocol: 'Протокол испытаний',
  tech_spec: 'Нормативный документ (ТУ/ПМ)',
  manual: 'Руководство по эксплуатации',
  passport: 'Паспорт оборудования',
};

/**
 * Создаёт документ через API и проверяет, что он отображается в списке и открывается в карточке.
 */
const checkCreatedCertificate = async (
  apiRequest: APIRequestContext,
  certificationSearchPage: CertificationSearchPage,
  certificationDetailPage: CertificationDetailPage,
  resourceType: CertificationResourceType,
  data: CertificationData
): Promise<void> => {
  const created = await test.step('Создать документ через API', async () => {
    const certificate = await createCertificationViaApi(apiRequest, resourceType, data);
    await test.info().attach('created-certification', {
      body: JSON.stringify(certificate, null, 2),
      contentType: 'application/json',
    });
    return certificate;
  });

  await test.step('Документ создан с файлом и доступен по pk через API', async () => {
    expect(created.pk).toBeTruthy();
    expect(created.fileUrl).toContain('/media/');

    const fromApi = await getCertificationViaApi(apiRequest, resourceType, created.pk);
    expect(fromApi).not.toBeNull();
    expect(fromApi?.name).toBe(data.name);
    expect(fromApi?.number).toBe(data.number);
    expect(fromApi?.status).toBe(STATUS_LABELS[data.status]);
  });

  await test.step('Документ найден в списке по наименованию', async () => {
    const fromApi = await findCertificationsByNameViaApi(apiRequest, resourceType, data.name);
    expect(fromApi.map((item) => item.pk)).toEqual([created.pk]);

    await certificationSearchPage.open(resourceType);
    await expect(certificationSearchPage.locators.heading).toHaveText('Сертификация');
    await certificationSearchPage.searchByName(data.name);

    await expect(certificationSearchPage.locators.documentsCounter).toHaveText('Документы (1)');
    await expect(certificationSearchPage.locators.paginationInfo).toHaveText('Показано 1-1 из 1');

    const row = certificationSearchPage.locators.docRow(data.name);
    await expect(row).toBeVisible();
    await expect(row).toContainText(data.name);
    await expect(row).toContainText(data.number);
    await expect(row).toContainText(STATUS_LABELS[data.status]);
    // Колонка «Действителен» в списке показывает дату окончания документа.
    await expect(row).toContainText(formatDotDmy(parseYmd(data.expiryDate)));
  });

  await test.step('Карточка документа открывается из списка и содержит данные документа', async () => {
    await certificationSearchPage.openDocument(data.name);
    await expect(certificationDetailPage.locators.heading).toHaveText('Просмотр документа');
    await expect(certificationDetailPage.locators.documentTypeCaption).toHaveText(
      DOCUMENT_TYPE_LABELS[resourceType]
    );
    await expect(certificationDetailPage.locators.fieldValue('Наименование')).toHaveText(data.name);
    await expect(certificationDetailPage.locators.fieldValue('Номер / Обозначение')).toHaveText(
      data.number
    );
    await expect(certificationDetailPage.locators.fieldValue('Статус')).toContainText(
      STATUS_LABELS[data.status]
    );
    await expect(certificationDetailPage.locators.fieldValue('Дата начала')).toHaveText(
      formatDotDmy(parseYmd(data.startDate))
    );
    await expect(certificationDetailPage.locators.fieldValue('Дата окончания')).toHaveText(
      formatDotDmy(parseYmd(data.expiryDate))
    );
  });

  await test.step('Карточка документа доступна по прямой ссылке с pk', async () => {
    await certificationDetailPage.open(resourceType, created.pk);
    await expect(certificationDetailPage.locators.heading).toHaveText('Просмотр документа');
    await expect(certificationDetailPage.locators.fieldValue('Наименование')).toHaveText(data.name);
  });
};

/**
 * Проверяет, что «Предпросмотр» открывает файл документа в отдельной вкладке.
 */
const previewCertificate = async (
  page: Page,
  apiRequest: APIRequestContext,
  certificationDetailPage: CertificationDetailPage,
  resourceType: CertificationResourceType,
  data: CertificationData
): Promise<void> => {
  const created = await test.step('Создать документ через API', async () => {
    const certificate = await createCertificationViaApi(apiRequest, resourceType, data);
    await test.info().attach('created-certification', {
      body: JSON.stringify(certificate, null, 2),
      contentType: 'application/json',
    });
    return certificate;
  });

  await test.step('Открыть карточку документа', async () => {
    await certificationDetailPage.open(resourceType, created.pk);
    await expect(certificationDetailPage.locators.heading).toHaveText('Просмотр документа');
  });

  await test.step('Кнопка «Предпросмотр» активна, так как у документа есть файл', async () => {
    await expect(certificationDetailPage.locators.previewButton).toBeEnabled();
  });

  const fileResponse = page.waitForResponse(
    (response) => response.url().includes('/media/') && response.ok(),
    { timeout: 30_000 }
  );

  const previewTab =
    await test.step('Нажать «Предпросмотр» и дождаться новой вкладки', async () => {
      const tab = await certificationDetailPage.preview();
      await expect(tab).not.toBe(page);
      return tab;
    });

  await test.step('В новой вкладке открыт файл документа', async () => {
    // Приложение скачивает файл документа и открывает его в отдельной вкладке по blob-ссылке.
    // В headless Chromium PDF-плагин отсутствует, поэтому вместо blob-ссылки проверяем
    // сам запрос файла: приложение должно отдать загруженный документ с кодом 200.
    const response = await fileResponse;
    expect(response.status()).toBe(200);
    expect(response.url()).toBe(created.fileUrl);
    expect(response.headers()['content-type']).toContain('application/pdf');
  });

  await test.step('Карточка документа осталась открытой', async () => {
    await expect(certificationDetailPage.locators.heading).toHaveText('Просмотр документа');
  });

  await test.step('Закрыть вкладку предпросмотра', async () => {
    await previewTab.close();
  });
};

test.describe('Просмотр сертификационных документов', () => {
  test(
    'Документ, созданный через API, отображается в списке и карточке (Сертификат)',
    { tag: '@smoke' },
    async ({ apiRequest, certificationSearchPage, certificationDetailPage }) => {
      await checkCreatedCertificate(
        apiRequest,
        certificationSearchPage,
        certificationDetailPage,
        'certificate',
        certificationFactory.certificate()
      );
    }
  );

  test('Документ, созданный через API, отображается в списке и карточке (Протокол испытаний)', async ({
    apiRequest,
    certificationSearchPage,
    certificationDetailPage,
  }) => {
    await checkCreatedCertificate(
      apiRequest,
      certificationSearchPage,
      certificationDetailPage,
      'protocol',
      certificationFactory.protocol()
    );
  });

  test('Документ, созданный через API, отображается в списке и карточке (ТУ/ПМ)', async ({
    apiRequest,
    certificationSearchPage,
    certificationDetailPage,
  }) => {
    await checkCreatedCertificate(
      apiRequest,
      certificationSearchPage,
      certificationDetailPage,
      'tech_spec',
      certificationFactory.techSpec()
    );
  });

  test('Документ, созданный через API, отображается в списке и карточке (Руководство по эксплуатации)', async ({
    apiRequest,
    certificationSearchPage,
    certificationDetailPage,
  }) => {
    await checkCreatedCertificate(
      apiRequest,
      certificationSearchPage,
      certificationDetailPage,
      'manual',
      certificationFactory.manual()
    );
  });

  test('Документ, созданный через API, отображается в списке и карточке (Паспорт оборудования)', async ({
    apiRequest,
    certificationSearchPage,
    certificationDetailPage,
  }) => {
    await checkCreatedCertificate(
      apiRequest,
      certificationSearchPage,
      certificationDetailPage,
      'passport',
      certificationFactory.passport()
    );
  });
});

test.describe('Предпросмотр сертификационных документов', () => {
  test('Кнопка «Предпросмотр» открывает файл сертификата в новой вкладке', async ({
    page,
    apiRequest,
    certificationDetailPage,
  }) => {
    await previewCertificate(
      page,
      apiRequest,
      certificationDetailPage,
      'certificate',
      certificationFactory.certificate()
    );
  });

  test('Кнопка «Предпросмотр» открывает файл протокола испытаний в новой вкладке', async ({
    page,
    apiRequest,
    certificationDetailPage,
  }) => {
    await previewCertificate(
      page,
      apiRequest,
      certificationDetailPage,
      'protocol',
      certificationFactory.protocol()
    );
  });

  test('Кнопка «Предпросмотр» открывает файл паспорта оборудования в новой вкладке', async ({
    page,
    apiRequest,
    certificationDetailPage,
  }) => {
    await previewCertificate(
      page,
      apiRequest,
      certificationDetailPage,
      'passport',
      certificationFactory.passport()
    );
  });
});
