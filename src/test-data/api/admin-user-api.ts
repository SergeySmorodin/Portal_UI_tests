import { APIRequestContext, Page } from '@playwright/test';
import { config } from '../../config';

/**
 * pk должности с потоком `project_supervision` (/api/admin/users/position/).
 * Без должности с потоком портал не даёт доступ к карточке работы
 * (`GET /api/project/opt2/<pk>/` отвечает 403) и страница создания заявки
 * не грузит данные проекта.
 *
 * Группы портала через админку больше не назначаются — для них есть
 * API /api/users/profile/<uuid>/groups/ (см. addUserToGroups).
 */
export const SUPERVISION_POSITION_PK = '581';

/** Авторизует страницу в Django Admin (сессия портала для этого недостаточно). */
export const loginDjangoAdmin = async (page: Page): Promise<void> => {
  await page.goto('/api/admin/login/?next=/api/admin/users/user/', {
    waitUntil: 'domcontentloaded',
  });
  await page.fill('input[name="username"]', config.login);
  await page.fill('input[name="password"]', config.password);
  await page.click('input[type="submit"]');
  await page.waitForURL((url) => !url.pathname.includes('/admin/login'), {
    timeout: config.timeouts.long,
  });
};

/** Собирает значения формы админки в виде строки `application/x-www-form-urlencoded`. */
const collectAdminForm = async (page: Page): Promise<string> => {
  const raw = await page.evaluate(() => {
    const form =
      document.querySelector('form#user_form') ??
      Array.from(document.querySelectorAll('form')).find((f) =>
        f.querySelector('[name="username"]')
      );

    const params: Array<[string, string]> = [];
    for (const element of Array.from(form?.querySelectorAll('input, select, textarea') ?? [])) {
      const name = element.getAttribute('name');
      if (!name) continue;
      if (name.startsWith('position_user-') && name.includes('__prefix__')) continue;

      if (element instanceof HTMLInputElement) {
        const type = (element.getAttribute('type') ?? 'text').toLowerCase();
        if (['file', 'submit', 'button', 'image'].includes(type)) continue;
        if (['checkbox', 'radio'].includes(type) && !element.checked) continue;
        params.push([name, element.value]);
      } else if (element instanceof HTMLSelectElement) {
        for (const option of Array.from(element.selectedOptions)) params.push([name, option.value]);
      } else {
        params.push([name, (element as HTMLTextAreaElement).value]);
      }
    }
    return params;
  });

  const params = new URLSearchParams();
  for (const [name, value] of raw) {
    if (name.startsWith('csrf')) continue;
    params.append(name, value);
  }
  return params.toString();
};

/** Добавляет пустую строку в инлайн-форму должностей, если её ещё нет. */
const addPositionRow = async (page: Page): Promise<void> => {
  // Ссылка «Добавить ещё один …» спрятана в свёрнутом <details>, поэтому кликаем
  // нативно из DOM: иначе admin-скрипт Django не обрабатывает событие.
  const clicked = await page.evaluate(() => {
    const template = document.querySelector('input[name="position_user-__prefix__-position"]');
    const link = template?.closest('details')?.querySelector<HTMLAnchorElement>('.add-row a');
    link?.click();
    return Boolean(link);
  });

  if (!clicked) {
    throw new Error('На странице пользователя не найдена кнопка добавления должности');
  }
  await page.locator('[name="position_user-0-position"]').waitFor({ state: 'attached' });
};

/** «1234567890123» -> «123-456-789 01»: админка принимает СНИЛС только в этом формате. */
const formatSnils = (snils: string): string => {
  const digits = snils.replace(/\D/g, '');
  return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6, 9)} ${digits.slice(9, 11)}`;
};

let personalNumberSeq = 0;

/**
 * Табельный номер должен быть уникален в пределах должности, иначе админка
 * отвечает ошибкой «Человек на должности с таким Табельный номер уже существует».
 */
const nextPersonalNumber = (): string => {
  personalNumberSeq += 1;
  return String((Date.now() + personalNumberSeq * 7919) % 1_000_000_000);
};

/**
 * Назначает пользователю должности через форму Django Admin.
 *
 * У пользователя, созданного через `/api/auth/users/`, нет потока, поэтому без
 * должности портал не отдаёт карточку работы и не принимает заявку. Группы при
 * этом не трогаются: они назначаются через API addUserToGroups.
 *
 * Дополнительно проставляется `kind` (вид занятости): без него (`worker`)
 * сотрудник не попадает в кандидатов `available_user` карточки работы
 * (`GET /api/project/opt1/<pk>/`) — фильтр отбрасывает пользователей
 * без вида занятости и с `office`.
 */
export const assignPortalPosition = async (
  request: APIRequestContext,
  page: Page,
  uuid: string,
  snils: string,
  positionPk: string,
  kind: string = 'worker'
): Promise<void> => {
  const changeUrl = `/api/admin/users/user/${uuid}/change/`;
  await page.goto(changeUrl, { waitUntil: 'domcontentloaded' });

  await addPositionRow(page);

  const params = new URLSearchParams(await collectAdminForm(page));
  params.set('snils', formatSnils(snils));
  params.set('kind', kind);
  params.set('position_user-0-position', positionPk);
  params.set('position_user-0-rate_pay', '1.00');
  params.set('position_user-0-personal_number', nextPersonalNumber());
  params.set('position_user-0-uuid', '');
  params.set('_save', 'Сохранить');

  const csrf = await page.evaluate(
    () =>
      (document.querySelector('[name="csrfmiddlewaretoken"]') as HTMLInputElement | null)?.value ??
      ''
  );

  const response = await request.post(changeUrl, {
    headers: {
      Referer: page.url(),
      'X-CSRFToken': csrf,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    data: params.toString(),
    maxRedirects: 0,
  });

  if (response.status() !== 302) {
    const errors = (
      (await response.text()).match(/<ul class="errorlist"[\s\S]{0,200}?<\/ul>/g) ?? []
    )
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim();
    throw new Error(
      `Назначение должности ${positionPk} не удалось (${response.status()}): ${errors || 'форма не принята'}`
    );
  }
};
