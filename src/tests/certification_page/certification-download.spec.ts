import { test, expect } from '../../fixtures/test-fixtures';
import { api } from '../../test-data/api/api-handles';
import { certificationFactory } from '../../test-data/factory/certification-factory';
import type {
  CertificationDetailPage,
  CertificationSearchPage,
} from '../../pages/certification/certification-page';
import type { CertificationData } from '../../types';
import { uploadCertificate } from './upload-helper';

const downloadCertificate = async (
  certificationSearchPage: CertificationSearchPage,
  certificationDetailPage: CertificationDetailPage,
  data: CertificationData
): Promise<void> => {
  await test.step('Найти документ в списке и открыть карточку документа', async () => {
    await certificationSearchPage.open(data.resourceType);
    await certificationSearchPage.searchByName(data.name);
    await expect(certificationSearchPage.locators.docRow(data.name)).toBeVisible();
    await certificationSearchPage.openDocument(data.name);
  });

  await test.step('Нажать «Скачать» и проверить скачивание файла', async () => {
    await expect(certificationDetailPage.locators.heading).toHaveText('Просмотр документа');
    const download = await certificationDetailPage.download();
    expect(download.suggestedFilename()).toBe(`${data.number}.pdf`);
  });
};

test.describe('Скачивание сертификационных документов', () => {
  test(
    'Скачивание разрешительного документа (Сертификат)',
    { tag: '@smoke' },
    async ({ certificationUploadPage, certificationSearchPage, certificationDetailPage }) => {
      const data: CertificationData = certificationFactory.certificate();
      await uploadCertificate(
        certificationUploadPage,
        certificationSearchPage,
        api.certification.certificate,
        data
      );
      await downloadCertificate(certificationSearchPage, certificationDetailPage, data);
    }
  );

  test('Скачивание протокола испытаний', async ({
    certificationUploadPage,
    certificationSearchPage,
    certificationDetailPage,
  }) => {
    const data: CertificationData = certificationFactory.protocol();
    await uploadCertificate(
      certificationUploadPage,
      certificationSearchPage,
      api.certification.protocol,
      data
    );
    await downloadCertificate(certificationSearchPage, certificationDetailPage, data);
  });

  test('Скачивание нормативного документа (ТУ/ПМ)', async ({
    certificationUploadPage,
    certificationSearchPage,
    certificationDetailPage,
  }) => {
    const data: CertificationData = certificationFactory.techSpec();
    await uploadCertificate(
      certificationUploadPage,
      certificationSearchPage,
      api.certification.techSpec,
      data
    );
    await downloadCertificate(certificationSearchPage, certificationDetailPage, data);
  });

  test('Скачивание руководства по эксплуатации', async ({
    certificationUploadPage,
    certificationSearchPage,
    certificationDetailPage,
  }) => {
    const data: CertificationData = certificationFactory.manual();
    await uploadCertificate(
      certificationUploadPage,
      certificationSearchPage,
      api.certification.manual,
      data
    );
    await downloadCertificate(certificationSearchPage, certificationDetailPage, data);
  });

  test('Скачивание паспорта оборудования', async ({
    certificationUploadPage,
    certificationSearchPage,
    certificationDetailPage,
  }) => {
    const data: CertificationData = certificationFactory.passport();
    await uploadCertificate(
      certificationUploadPage,
      certificationSearchPage,
      api.certification.passport,
      data
    );
    await downloadCertificate(certificationSearchPage, certificationDetailPage, data);
  });
});
