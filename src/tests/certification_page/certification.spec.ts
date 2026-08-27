import { test, expect } from '../../fixtures/test-fixtures';
import { api } from '../../data/api';
import { certificationFactory } from '../../data/certification-factory';
import { CertificationData } from '../../types';
import type {
  CertificationUploadPage,
  CertificationSearchPage,
} from '../../pages/certification/certification-page';

const uploadCertificate = async (
  certificationUploadPage: CertificationUploadPage,
  certificationSearchPage: CertificationSearchPage,
  apiPath: string,
  data: CertificationData
): Promise<void> => {
  await certificationUploadPage.open();
  await expect(certificationUploadPage.locators.heading).toHaveText('Загрузка документа');

  await certificationUploadPage.selectResourceType(data.resourceType);
  if (data.docType) {
    await certificationUploadPage.selectDocType(data.docType);
  }
  await certificationUploadPage.selectStatus(data.status);
  await certificationUploadPage.fillBasicFields(data);
  await certificationUploadPage.setFile();
  await certificationUploadPage.setDates(data);
  await certificationUploadPage.runAndCheckResponse(apiPath, () => certificationUploadPage.save());

  await certificationSearchPage.open(data.resourceType);
  await certificationSearchPage.searchByName(data.name);
  const row = certificationSearchPage.locators.docRow(data.name);
  await expect(row).toBeVisible();
};

test.describe('Загрузка сертификационных документов', () => {
  test('Загрузка разрешительного документа (Сертификат)', async ({
    certificationUploadPage,
    certificationSearchPage,
  }) => {
    const data: CertificationData = certificationFactory.certificate();
    await uploadCertificate(
      certificationUploadPage,
      certificationSearchPage,
      api.certification.certificate,
      data
    );
  });

  test('Загрузка протокола испытаний', async ({
    certificationUploadPage,
    certificationSearchPage,
  }) => {
    const data: CertificationData = certificationFactory.protocol();
    await uploadCertificate(
      certificationUploadPage,
      certificationSearchPage,
      api.certification.protocol,
      data
    );
  });

  test('Загрузка нормативного документа (ТУ/ПМ)', async ({
    certificationUploadPage,
    certificationSearchPage,
  }) => {
    const data: CertificationData = certificationFactory.techSpec();
    await uploadCertificate(
      certificationUploadPage,
      certificationSearchPage,
      api.certification.techSpec,
      data
    );
  });

  test('Загрузка руководства по эксплуатации', async ({
    certificationUploadPage,
    certificationSearchPage,
  }) => {
    const data: CertificationData = certificationFactory.manual();
    await uploadCertificate(
      certificationUploadPage,
      certificationSearchPage,
      api.certification.manual,
      data
    );
  });

  test('Загрузка паспорта оборудования', async ({
    certificationUploadPage,
    certificationSearchPage,
  }) => {
    const data: CertificationData = certificationFactory.passport();
    await uploadCertificate(
      certificationUploadPage,
      certificationSearchPage,
      api.certification.passport,
      data
    );
  });
});
