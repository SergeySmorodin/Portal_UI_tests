import { test, expect } from '../../fixtures/test-fixtures';
import type {
  CertificationUploadPage,
  CertificationSearchPage,
} from '../../pages/certification/certification-page';
import type { CertificationData } from '../../types';

/**
 * Загружает сертификационный документ через форму загрузки и находит его в списке.
 * Общий шаг для тестов загрузки и скачивания документов.
 */
export const uploadCertificate = async (
  certificationUploadPage: CertificationUploadPage,
  certificationSearchPage: CertificationSearchPage,
  apiPath: string,
  data: CertificationData
): Promise<void> => {
  await test.step('Открыть страницу загрузки документа', async () => {
    await certificationUploadPage.open();
    await expect(certificationUploadPage.locators.heading).toHaveText('Загрузка документа');
  });

  await test.step('Выбрать тип и заполнить основные поля', async () => {
    await certificationUploadPage.selectResourceType(data.resourceType);
    if (data.docType) {
      await certificationUploadPage.selectDocType(data.docType);
    }
    await certificationUploadPage.selectStatus(data.status);
    await certificationUploadPage.fillBasicFields(data);
  });

  await test.step('Загрузить файл и установить даты', async () => {
    await certificationUploadPage.setFile();
    await certificationUploadPage.setDates(data);
  });

  await test.step('Сохранить документ', async () => {
    await certificationUploadPage.runAndCheckResponse(apiPath, () =>
      certificationUploadPage.save()
    );
  });

  await test.step('Найти документ в списке', async () => {
    await certificationSearchPage.open(data.resourceType);
    await certificationSearchPage.searchByName(data.name);
    const row = certificationSearchPage.locators.docRow(data.name);
    await expect(row).toBeVisible();
  });
};
