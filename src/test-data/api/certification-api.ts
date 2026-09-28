import { readFileSync } from 'node:fs';
import path from 'node:path';
import { APIRequestContext } from '@playwright/test';
import { CertificationData } from '../../types';
import {
  certificationEndpoint,
  certificationItemEndpoint,
  type CertificationResourceType,
} from './api-handles';

/** Реальный PDF из репозитория: предпросмотр в браузере не отрисует произвольный буфер. */
const TEST_PDF = {
  name: 'test-protocol.pdf',
  mimeType: 'application/pdf',
  buffer: readFileSync(path.join(process.cwd(), 'src', 'test-data', 'test-protocol.pdf')),
};

export interface CreatedCertification {
  /** pk созданного документа: cert_/prot_/tech_/man_/pass_. */
  pk: string;
  name: string;
  number: string;
  /** Ссылка на загруженный файл документа (без файла кнопка «Предпросмотр» неактивна). */
  fileUrl: string | null;
}

export interface CertificationFromApi {
  pk: string;
  name: string;
  number: string;
  doc_type: string | null;
  status: string;
  is_perpetual: boolean;
  start_date: string;
  expiry_date: string | null;
  code_scan: string | null;
}

interface CertificationListResponse {
  count: number;
  results: CertificationFromApi[];
}

/**
 * Создаёт сертификационный документ через API (multipart), минуя форму загрузки.
 * Файл документа обязателен, иначе на карточке документа кнопка «Предпросмотр» неактивна.
 */
export const createCertificationViaApi = async (
  request: APIRequestContext,
  resourceType: CertificationResourceType,
  data: CertificationData
): Promise<CreatedCertification> => {
  const response = await request.post(certificationEndpoint(resourceType), {
    multipart: {
      name: data.name,
      number: data.number,
      ...(data.docType ? { doc_type: data.docType } : {}),
      status: data.status,
      is_perpetual: 'false',
      start_date: data.startDate,
      expiry_date: data.expiryDate,
      expire_warning_period: data.warningPeriod,
      code_scan: TEST_PDF,
    },
  });

  if (!response.ok()) {
    throw new Error(
      `Создание документа через API не удалось (${response.status()}): ${await response.text()}`
    );
  }

  const body = (await response.json()) as {
    pk: string;
    name: string;
    number: string;
    code_scan: string | null;
  };

  return { pk: body.pk, name: body.name, number: body.number, fileUrl: body.code_scan };
};

/** Возвращает документ по pk через API или null, если его нет. */
export const getCertificationViaApi = async (
  request: APIRequestContext,
  resourceType: CertificationResourceType,
  pk: string
): Promise<CertificationFromApi | null> => {
  const response = await request.get(certificationItemEndpoint(resourceType, pk));
  if (response.status() === 404) return null;
  if (!response.ok()) {
    throw new Error(
      `Получение документа через API не удалось (${response.status()}): ${await response.text()}`
    );
  }
  return (await response.json()) as CertificationFromApi;
};

/** Ищет документы по наименованию через API списка (server-side поиск, как на странице списка). */
export const findCertificationsByNameViaApi = async (
  request: APIRequestContext,
  resourceType: CertificationResourceType,
  name: string
): Promise<CertificationFromApi[]> => {
  const response = await request.get(certificationEndpoint(resourceType), {
    params: { page: 1, page_size: 1000, search: name },
  });

  if (!response.ok()) {
    throw new Error(
      `Поиск документов через API не удалось (${response.status()}): ${await response.text()}`
    );
  }

  const body = (await response.json()) as CertificationListResponse;
  return body.results.filter((item) => item.name === name);
};
