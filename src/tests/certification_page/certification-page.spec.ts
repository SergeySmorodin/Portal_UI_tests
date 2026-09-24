import { test } from '../../fixtures/test-fixtures';
import { api } from '../../test-data/api/api-handles';
import { certificationFactory } from '../../test-data/factory/certification-factory';
import type { CertificationData } from '../../types';
import { uploadCertificate } from './upload-helper';

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
