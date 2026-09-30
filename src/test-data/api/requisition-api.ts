import { APIRequestContext } from '@playwright/test';
import { api } from './api-handles';

export interface Requisition {
  pk: string;
  status: string;
  comment: string;
  to_ts: { pk: string; full_name: string } | null;
  to_project: { pk: string; name: string; status: string } | null;
}

interface RequisitionList {
  results?: Requisition[];
}

const readList = async (response: { json: () => Promise<unknown> }): Promise<Requisition[]> => {
  const body = (await response.json()) as RequisitionList | Requisition[];
  return Array.isArray(body) ? body : (body.results ?? []);
};

const fetchAll = async (request: APIRequestContext, url: string): Promise<Requisition[]> => {
  const response = await request.get(url);
  if (!response.ok()) {
    throw new Error(`Запрос ${url} не удался (${response.status()}): ${await response.text()}`);
  }
  return readList(response);
};

/** Все заявки по конкретной работе (pk работы). */
export const getWorkRequisitions = async (
  request: APIRequestContext,
  workPk: string
): Promise<Requisition[]> => {
  const all = await fetchAll(request, `${api.requisition}?page_size=1000`);
  return all.filter((r) => r.to_project?.pk === workPk);
};

/** Список работ с заявкой в статусе «На согласовании» — источник данных /SKIP/requisitions. */
export const fetchSkipList = async (
  request: APIRequestContext
): Promise<Array<{ pk: string; name: string }>> => {
  const url = `${api.projectOpt2}?status_requisition=${encodeURIComponent(
    'На согласовании'
  )}&page=1&page_size=500`;
  const response = await request.get(url);
  if (!response.ok()) {
    throw new Error(
      `Запрос списка заявок СКИП не удался (${response.status()}): ${await response.text()}`
    );
  }
  const body = (await response.json()) as { results?: Array<{ pk: string; name: string }> };
  return body.results ?? [];
};

/**
 * Заявки, ожидающие обработки СКИП.
 * Список «Заявки на обработку (СКИП)» на /SKIP/requisitions строится
 * по работам с заявкой в статусе «На согласовании».
 */
export const isWorkAwaitingSkip = async (
  request: APIRequestContext,
  workPk: string
): Promise<boolean> => {
  const projects = await fetchSkipList(request);
  return projects.some((project) => project.pk === workPk);
};
