import { APIRequestContext } from '@playwright/test';
import { api } from './api-handles';

interface ContractDoc {
  pk: string;
}

/**
 * Удаляет файлы, прикреплённые к договору (DELETE /api/contract/load/docs/<pk>/).
 * Сам договор удалить нельзя: DELETE /api/contract/<pk>/ портал не поддерживает (405).
 */
export const deleteContractDocsViaApi = async (
  request: APIRequestContext,
  contractPk: string
): Promise<void> => {
  const response = await request.get(`${api.contract}${contractPk}/`);
  if (!response.ok()) {
    throw new Error(
      `Получение договора через API не удалось (${response.status()}): ${await response.text()}`
    );
  }

  const { docs = [] } = (await response.json()) as { docs?: ContractDoc[] };
  for (const doc of docs) {
    const deleted = await request.delete(`${api.contractDocs}${doc.pk}/`);
    if (!deleted.ok()) {
      throw new Error(
        `Удаление файла договора ${doc.pk} не удалось (${deleted.status()}): ${await deleted.text()}`
      );
    }
  }
};
