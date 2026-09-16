import { test } from '../../fixtures/test-fixtures';
import { runOtPbTests, runLaborProtectionProtocolTests } from './ot-pb-helpers';
import { formatDmy } from '../../utils/date';

test.describe('Отчеты ПБ страницы', () => {
  runOtPbTests('industrialSafety', {
    name: 'Промышленная безопасность',
    headingText: 'Промышленная безопасность',
    openStep: 'Открыть страницу промышленной безопасности',
    categories: [],
  });

  runOtPbTests('laborProtection', {
    name: 'Охрана труда',
    headingText: 'Охрана труда',
    openStep: 'Открыть страницу охраны труда',
    categories: [
      'Охрана труда',
      'Электробезопасность',
      'Работа на высоте',
      'Первая помощь',
      'Газоопасные работы',
      'Применение СИЗ',
      'Сизод',
      'Работа в люльке',
      'Журнал проведения противопожарного инструктажа (ППИ/ПТМ)',
      'Ограниченное Замкнутое Пространство',
      'Стропальщик',
    ],
  });

  runLaborProtectionProtocolTests({
    openStep: 'Открыть страницу охраны труда',
    protocolDate: formatDmy(new Date()),
    filePath: 'src/test-data/test-protocol.pdf',
  });

  runOtPbTests('medicalCommission', {
    name: 'Медицинская комиссия',
    headingText: 'Медицинская комиссия',
    openStep: 'Открыть страницу медицинской комиссии',
    categories: ['Медицинская комиссия', 'Психиатрическое освидетельствование'],
  });
});
