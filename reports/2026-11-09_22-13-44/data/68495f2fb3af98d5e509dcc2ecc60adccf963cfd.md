# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: services_page\supervision\project-visits.spec.ts >> Распределение на работу >> Создать работу через API и добавить визиты персонала, созданного через API
- Location: src\tests\services_page\supervision\project-visits.spec.ts:6:3

# Error details

```
Error: Сотрудник «Визитов Сотрудник1 Тестович» не найден в Доступном персонале
```

# Page snapshot

```yaml
- generic [ref=f1e3]:
  - banner [ref=f1e4]:
    - navigation [ref=f1e5]:
      - list [ref=f1e6]:
        - listitem [ref=f1e7]:
          - generic [ref=f1e8]:
            - generic [ref=f1e9] [cursor=pointer]
            - list [ref=f1e13]:
              - listitem [ref=f1e14]:
                - link " Главная" [ref=f1e15] [cursor=pointer]:
                  - /url: /
                  - generic [ref=f1e16]: 
                  - text: Главная
              - listitem [ref=f1e17]:
                - link " СКиП" [ref=f1e18] [cursor=pointer]:
                  - /url: /SKIP
                  - generic [ref=f1e19]: 
                  - text: СКиП
              - listitem [ref=f1e20]:
                - link " ТДО" [ref=f1e21] [cursor=pointer]:
                  - /url: /tdo/contracts
                  - generic [ref=f1e22]: 
                  - text: ТДО
              - listitem [ref=f1e23]:
                - link " Сопровождение проектов" [ref=f1e24] [cursor=pointer]:
                  - /url: /help/companys
                  - generic [ref=f1e25]: 
                  - text: Сопровождение проектов
              - listitem [ref=f1e26]:
                - link " Сервисы" [ref=f1e27] [cursor=pointer]:
                  - /url: /services
                  - generic [ref=f1e28]: 
                  - text: Сервисы
              - listitem [ref=f1e29]:
                - link " Технический директор" [ref=f1e30] [cursor=pointer]:
                  - /url: /TechnicalDirector
                  - generic [ref=f1e31]: 
                  - text: Технический директор
              - listitem [ref=f1e32]:
                - link " Охрана труда" [ref=f1e33] [cursor=pointer]:
                  - /url: /protection
                  - generic [ref=f1e34]: 
                  - text: Охрана труда
        - listitem [ref=f1e35]:
          - link [ref=f1e36] [cursor=pointer]:
            - /url: /
            - img "logo" [ref=f1e37]
        - listitem
        - listitem [ref=f1e38]:
          - link [ref=f1e39] [cursor=pointer]:
            - /url: /lk
            - heading "Смородин С.А." [level=3] [ref=f1e40]
        - listitem [ref=f1e41]:
          - link "" [ref=f1e42] [cursor=pointer]:
            - /url: /login
  - generic [ref=f1e44]:
    - navigation [ref=f1e45]:
      - link "" [ref=f1e46] [cursor=pointer]:
        - /url: /feedback
      - link "" [ref=f1e48] [cursor=pointer]:
        - /url: /feedback/admin
    - main [ref=f1e50]:
      - heading "Распределение на работу" [level=1] [ref=f1e51]
      - generic [ref=f1e53]:
        - button "Закрыть" [ref=f1e55] [cursor=pointer]
        - generic [ref=f1e56]:
          - button " Управление визитами" [disabled]:
            - generic: 
            - text: Управление визитами
        - generic [ref=f1e58]:
          - button "" [ref=f1e59] [cursor=pointer]
          - button "" [ref=f1e61] [cursor=pointer]
          - button "" [ref=f1e63] [cursor=pointer]
          - button "" [ref=f1e65] [cursor=pointer]
      - generic [ref=f1e68]:
        - generic [ref=f1e69]:
          - generic [ref=f1e71]:
            - heading "Работы" [level=3] [ref=f1e73]
            - generic [ref=f1e75]:
              - textbox "Поиск работы..." [ref=f1e78]
              - generic [ref=f1e79]:
                - button "Работа из проекта 2509_ОмскийНПЗ_С Выполнение работы" [ref=f1e80] [cursor=pointer]:
                  - generic [ref=f1e81]: Работа из проекта
                  - generic [ref=f1e82]: 2509_ОмскийНПЗ_С
                  - generic [ref=f1e83]: Выполнение работы
                - button "Работа из проекта 2512_ОЗСМ_С Выполнение работы" [ref=f1e84] [cursor=pointer]:
                  - generic [ref=f1e85]: Работа из проекта
                  - generic [ref=f1e86]: 2512_ОЗСМ_С
                  - generic [ref=f1e87]: Выполнение работы
                - button "2512_ЛукойлВНП_С (исключено) 2512_ЛукойлВНП_С Выполнение работы" [ref=f1e88] [cursor=pointer]:
                  - generic [ref=f1e89]: 2512_ЛукойлВНП_С (исключено)
                  - generic [ref=f1e90]: 2512_ЛукойлВНП_С
                  - generic [ref=f1e91]: Выполнение работы
                - button "Работа из проекта 2601_ОЗСМ_С Выполнение работы" [ref=f1e92] [cursor=pointer]:
                  - generic [ref=f1e93]: Работа из проекта
                  - generic [ref=f1e94]: 2601_ОЗСМ_С
                  - generic [ref=f1e95]: Выполнение работы
                - button "Работа из проекта 2602_ОЗСМ_С Подготовка" [ref=f1e96] [cursor=pointer]:
                  - generic [ref=f1e97]: Работа из проекта
                  - generic [ref=f1e98]: 2602_ОЗСМ_С
                  - generic [ref=f1e99]: Подготовка
                - button "2602_МНПЗ_С 2602_МНПЗ_С Выполнение работы" [ref=f1e100] [cursor=pointer]:
                  - generic [ref=f1e101]: 2602_МНПЗ_С
                  - generic [ref=f1e102]: 2602_МНПЗ_С
                  - generic [ref=f1e103]: Выполнение работы
                - button "2602_ОмскийНПЗ_С 2602_ОмскийНПЗ_С Выполнение работы" [ref=f1e104] [cursor=pointer]:
                  - generic [ref=f1e105]: 2602_ОмскийНПЗ_С
                  - generic [ref=f1e106]: 2602_ОмскийНПЗ_С
                  - generic [ref=f1e107]: Выполнение работы
                - button "2602_ЛИНК_С 2602_ЛИНК_С Выполнение работы" [ref=f1e108] [cursor=pointer]:
                  - generic [ref=f1e109]: 2602_ЛИНК_С
                  - generic [ref=f1e110]: 2602_ЛИНК_С
                  - generic [ref=f1e111]: Выполнение работы
                - button "2603_СС_ЛИНК_С 2603_СС_ЛИНК_С Завершение работы" [ref=f1e112] [cursor=pointer]:
                  - generic [ref=f1e113]: 2603_СС_ЛИНК_С
                  - generic [ref=f1e114]: 2603_СС_ЛИНК_С
                  - generic [ref=f1e115]: Завершение работы
                - button "2603_Ставролен_С 2603_Ставролен_С Выполнение работы" [ref=f1e116] [cursor=pointer]:
                  - generic [ref=f1e117]: 2603_Ставролен_С
                  - generic [ref=f1e118]: 2603_Ставролен_С
                  - generic [ref=f1e119]: Выполнение работы
                - button "2603_МКран_С 2603_МКран_С Выполнение работы" [ref=f1e120] [cursor=pointer]:
                  - generic [ref=f1e121]: 2603_МКран_С
                  - generic [ref=f1e122]: 2603_МКран_С
                  - generic [ref=f1e123]: Выполнение работы
                - button "Супервайзинг фланцевых соединений Руководитель работ ( на объекте ) - 1 чел.смен 2604_ЕХСЗ-2_С Подготовка" [ref=f1e124] [cursor=pointer]:
                  - generic [ref=f1e125]: Супервайзинг фланцевых соединений Руководитель работ ( на объекте ) - 1 чел.смен
                  - generic [ref=f1e126]: 2604_ЕХСЗ-2_С
                  - generic [ref=f1e127]: Подготовка
                - button "Супервайзинг ВидеоИнструкция Выполнение работы" [ref=f1e128] [cursor=pointer]:
                  - generic [ref=f1e129]: Супервайзинг
                  - generic [ref=f1e130]: ВидеоИнструкция
                  - generic [ref=f1e131]: Выполнение работы
                - button "Выполнение работ по техническому контролю (супервайзинг); Руководитель - 468 чел.час. Супервайзер (14 чел.) - 6552 чел.час. 2605_Апатит2_С Подготовка" [ref=f1e132] [cursor=pointer]:
                  - generic [ref=f1e133]: Выполнение работ по техническому контролю (супервайзинг); Руководитель - 468 чел.час. Супервайзер (14 чел.) - 6552 чел.час.
                  - generic [ref=f1e134]: 2605_Апатит2_С
                  - generic [ref=f1e135]: Подготовка
                - button "Инженерный (технический) контроль капитального ремонта; Руководитель - 451 чел.час. Супервайзер (2 чел.) - 902 чел.час. 2605_Апатит_С Подготовка" [ref=f1e136] [cursor=pointer]:
                  - generic [ref=f1e137]: Инженерный (технический) контроль капитального ремонта; Руководитель - 451 чел.час. Супервайзер (2 чел.) - 902 чел.час.
                  - generic [ref=f1e138]: 2605_Апатит_С
                  - generic [ref=f1e139]: Подготовка
                - button "Установка Висбрекинг цеха №41 Секция 3000 - 179 фл.соед. Руководитель работ - 22 чел/смены 2605_КИНЕФ_С Подготовка" [ref=f1e140] [cursor=pointer]:
                  - generic [ref=f1e141]: Установка Висбрекинг цеха №41 Секция 3000 - 179 фл.соед. Руководитель работ - 22 чел/смены
                  - generic [ref=f1e142]: 2605_КИНЕФ_С
                  - generic [ref=f1e143]: Подготовка
                - button "Супервайзеры по фланцевым соединения- 980 ч\\ч Супервайзеры по сварке -1000 ч\\ч 2605_РГНКНПЗ_С Подготовка" [ref=f1e144] [cursor=pointer]:
                  - generic [ref=f1e145]: Супервайзеры по фланцевым соединения- 980 ч\ч Супервайзеры по сварке -1000 ч\ч
                  - generic [ref=f1e146]: 2605_РГНКНПЗ_С
                  - generic [ref=f1e147]: Подготовка
                - button "Супервайзеры по фланцевым соединения- 2500 ч\\ч Супервайзеры по сварке -1200 ч\\ч (объем был скорректирован) 2605_РГКомсомольскийНПЗ_С Подготовка" [ref=f1e148] [cursor=pointer]:
                  - generic [ref=f1e149]: Супервайзеры по фланцевым соединения- 2500 ч\ч Супервайзеры по сварке -1200 ч\ч (объем был скорректирован)
                  - generic [ref=f1e150]: 2605_РГКомсомольскийНПЗ_С
                  - generic [ref=f1e151]: Подготовка
                - button "Технический контроль 1/2\" (М20) - 47 шт.; 3/4\" (М27) - 16 шт.; 1\" (М33) - 511 шт. 2606_ОЗСМ_С Подготовка" [ref=f1e152] [cursor=pointer]:
                  - generic [ref=f1e153]: Технический контроль 1/2" (М20) - 47 шт.; 3/4" (М27) - 16 шт.; 1" (М33) - 511 шт.
                  - generic [ref=f1e154]: 2606_ОЗСМ_С
                  - generic [ref=f1e155]: Подготовка
                - button "Оказание услуг технического контроля (супервайзинга) за сборкой фланцевых соединений 2606_СибурКстово_С Подготовка" [ref=f1e156] [cursor=pointer]:
                  - generic [ref=f1e157]: Оказание услуг технического контроля (супервайзинга) за сборкой фланцевых соединений
                  - generic [ref=f1e158]: 2606_СибурКстово_С
                  - generic [ref=f1e159]: Подготовка
                - button "Руководитель работ (на объекте) - 30 чел/смен Супервайзер (на объекте) - 60 чел/смен 2606_Аммоний_С Подготовка" [ref=f1e160] [cursor=pointer]:
                  - generic [ref=f1e161]: Руководитель работ (на объекте) - 30 чел/смен Супервайзер (на объекте) - 60 чел/смен
                  - generic [ref=f1e162]: 2606_Аммоний_С
                  - generic [ref=f1e163]: Подготовка
                - button "2603_СС_ЛИНК_С_АВТ_5 (исключен) 2603_СС_ЛИНК_С Завершение работы" [ref=f1e164] [cursor=pointer]:
                  - generic [ref=f1e165]: 2603_СС_ЛИНК_С_АВТ_5 (исключен)
                  - generic [ref=f1e166]: 2603_СС_ЛИНК_С
                  - generic [ref=f1e167]: Завершение работы
                - button "Супервайзеры по фланцевым соединения- 2300 ч\\ч Супервайзеры по сварке -2800 ч\\ч (объем был скорректирован) 2607_РГНЗМП_С Подготовка" [ref=f1e168] [cursor=pointer]:
                  - generic [ref=f1e169]: Супервайзеры по фланцевым соединения- 2300 ч\ч Супервайзеры по сварке -2800 ч\ч (объем был скорректирован)
                  - generic [ref=f1e170]: 2607_РГНЗМП_С
                  - generic [ref=f1e171]: Подготовка
                - 'button "Супервайзинг фланцевых соединений Л-35/11-600 Производство №5 Объем работ: 77 человеко-часов, ставка 2026 год. 2607_ОмскийНПЗ_С Подготовка" [ref=f1e172] [cursor=pointer]':
                  - generic [ref=f1e173]: "Супервайзинг фланцевых соединений Л-35/11-600 Производство №5 Объем работ: 77 человеко-часов, ставка 2026 год."
                  - generic [ref=f1e174]: 2607_ОмскийНПЗ_С
                  - generic [ref=f1e175]: Подготовка
                - 'button "КГПН УГК Производство №3 Супервайзинг фланцевых соединений Объем работ: 264 человеко-часов 2602_ОмскийНПЗ_С Подготовка" [ref=f1e176] [cursor=pointer]':
                  - generic [ref=f1e177]: "КГПН УГК Производство №3 Супервайзинг фланцевых соединений Объем работ: 264 человеко-часов"
                  - generic [ref=f1e178]: 2602_ОмскийНПЗ_С
                  - generic [ref=f1e179]: Подготовка
                - button "Руководитель работ (на объекте) - 40 ч/ч 2608_Казаньоргсинтез_С Подготовка" [ref=f1e180] [cursor=pointer]:
                  - generic [ref=f1e181]: Руководитель работ (на объекте) - 40 ч/ч
                  - generic [ref=f1e182]: 2608_Казаньоргсинтез_С
                  - generic [ref=f1e183]: Подготовка
                - button "Композитная ремонтнаяя муфта, Standard, 10 кв.м, 200 мм - 5 шт. Фиксирующая лента 5х200 - 5 шт. 2608_Казаньоргсинтез_С Подготовка" [ref=f1e184] [cursor=pointer]:
                  - generic [ref=f1e185]: Композитная ремонтнаяя муфта, Standard, 10 кв.м, 200 мм - 5 шт. Фиксирующая лента 5х200 - 5 шт.
                  - generic [ref=f1e186]: 2608_Казаньоргсинтез_С
                  - generic [ref=f1e187]: Подготовка
                - button "Супервайзер по фланцевым соединениям, 1 чел. 10 смен 2608_УстьЛуга_С Подготовка" [ref=f1e188] [cursor=pointer]:
                  - generic [ref=f1e189]: Супервайзер по фланцевым соединениям, 1 чел. 10 смен
                  - generic [ref=f1e190]: 2608_УстьЛуга_С
                  - generic [ref=f1e191]: Подготовка
                - button "Супервайзер СС - 1380 ч/ч (138 чел\\дн) (исключен) 2605_МНПЗ_С Подготовка" [ref=f1e192] [cursor=pointer]:
                  - generic [ref=f1e193]: Супервайзер СС - 1380 ч/ч (138 чел\дн) (исключен)
                  - generic [ref=f1e194]: 2605_МНПЗ_С
                  - generic [ref=f1e195]: Подготовка
                - button "Супервайзеры по сварке - 486 ч\\ч 2605_РГНКНПЗ_С Подготовка" [ref=f1e196] [cursor=pointer]:
                  - generic [ref=f1e197]: Супервайзеры по сварке - 486 ч\ч
                  - generic [ref=f1e198]: 2605_РГНКНПЗ_С
                  - generic [ref=f1e199]: Подготовка
                - button "Супервайзеры по фланцевым соединения- 589 ч\\ч Супервайзеры по сварке -500 ч\\ч (объем скорректирован) 2605_РГНКНПЗ_С Подготовка" [ref=f1e200] [cursor=pointer]:
                  - generic [ref=f1e201]: Супервайзеры по фланцевым соединения- 589 ч\ч Супервайзеры по сварке -500 ч\ч (объем скорректирован)
                  - generic [ref=f1e202]: 2605_РГНКНПЗ_С
                  - generic [ref=f1e203]: Подготовка
                - button "2609_ОмскийНПЗ_СМР_Супервайзинг 2609_ОмскийНПЗ_СМР Подготовка" [ref=f1e204] [cursor=pointer]:
                  - generic [ref=f1e205]: 2609_ОмскийНПЗ_СМР_Супервайзинг
                  - generic [ref=f1e206]: 2609_ОмскийНПЗ_СМР
                  - generic [ref=f1e207]: Подготовка
                - button "2606_МНПЗ_Б_СупервайзингФС 2606_МНПЗ_Б Подготовка" [ref=f1e208] [cursor=pointer]:
                  - generic [ref=f1e209]: 2606_МНПЗ_Б_СупервайзингФС
                  - generic [ref=f1e210]: 2606_МНПЗ_Б
                  - generic [ref=f1e211]: Подготовка
                - button "Супервайзеры по фланцевым соединения- 366 ч\\ч Супервайзеры по сварке -874 ч\\ч 2607_РГНЗМП_С Подготовка" [ref=f1e212] [cursor=pointer]:
                  - generic [ref=f1e213]: Супервайзеры по фланцевым соединения- 366 ч\ч Супервайзеры по сварке -874 ч\ч
                  - generic [ref=f1e214]: 2607_РГНЗМП_С
                  - generic [ref=f1e215]: Подготовка
                - button "home_work HOME_07-10 Подготовка" [ref=f1e216] [cursor=pointer]:
                  - generic [ref=f1e217]: home_work
                  - generic [ref=f1e218]: HOME_07-10
                  - generic [ref=f1e219]: Подготовка
                - button "8ОКТЯБРЯ ПЕРЕДРЕЛИЗОМ Подготовка" [ref=f1e220] [cursor=pointer]:
                  - generic [ref=f1e221]: 8ОКТЯБРЯ
                  - generic [ref=f1e222]: ПЕРЕДРЕЛИЗОМ
                  - generic [ref=f1e223]: Подготовка
                - button "Билеты ПЕРЕДРЕЛИЗОМ Подготовка" [ref=f1e224] [cursor=pointer]:
                  - generic [ref=f1e225]: Билеты
                  - generic [ref=f1e226]: ПЕРЕДРЕЛИЗОМ
                  - generic [ref=f1e227]: Подготовка
                - button "12321312321 ПЕРЕДРЕЛИЗОМ Подготовка" [ref=f1e228] [cursor=pointer]:
                  - generic [ref=f1e229]: "12321312321"
                  - generic [ref=f1e230]: ПЕРЕДРЕЛИЗОМ
                  - generic [ref=f1e231]: Подготовка
                - button "проверка табял ПЕРЕДРЕЛИЗОМ Подготовка" [ref=f1e232] [cursor=pointer]:
                  - generic [ref=f1e233]: проверка табял
                  - generic [ref=f1e234]: ПЕРЕДРЕЛИЗОМ
                  - generic [ref=f1e235]: Подготовка
                - button "поехали For test Подготовка" [ref=f1e236] [cursor=pointer]:
                  - generic [ref=f1e237]: поехали
                  - generic [ref=f1e238]: For test
                  - generic [ref=f1e239]: Подготовка
                - button "Планирование проверка 2603_СпецИнжСтрой_Вн Выполнение работы" [ref=f1e240] [cursor=pointer]:
                  - generic [ref=f1e241]: Планирование проверка
                  - generic [ref=f1e242]: 2603_СпецИнжСтрой_Вн
                  - generic [ref=f1e243]: Выполнение работы
                - button "РАБОТА-1794228970921-dd89b455 ТЕСТ-1794228970710-f4df1b9e Подготовка" [ref=f1e244] [cursor=pointer]:
                  - generic [ref=f1e245]: РАБОТА-1794228970921-dd89b455
                  - generic [ref=f1e246]: ТЕСТ-1794228970710-f4df1b9e
                  - generic [ref=f1e247]: Подготовка
                - button "РАБОТА-1794229043405-0ab5ae0c ТЕСТ-1794229043204-17172857 Подготовка" [ref=f1e248] [cursor=pointer]:
                  - generic [ref=f1e249]: РАБОТА-1794229043405-0ab5ae0c
                  - generic [ref=f1e250]: ТЕСТ-1794229043204-17172857
                  - generic [ref=f1e251]: Подготовка
                - button "РАБОТА-1794229064057-7edd33eb ТЕСТ-1794229063843-868547e9 Подготовка" [ref=f1e252] [cursor=pointer]:
                  - generic [ref=f1e253]: РАБОТА-1794229064057-7edd33eb
                  - generic [ref=f1e254]: ТЕСТ-1794229063843-868547e9
                  - generic [ref=f1e255]: Подготовка
                - button "РАБОТА-1794229119046-e64ab88e ТЕСТ-1794229118833-72cc7f7e Подготовка" [ref=f1e256] [cursor=pointer]:
                  - generic [ref=f1e257]: РАБОТА-1794229119046-e64ab88e
                  - generic [ref=f1e258]: ТЕСТ-1794229118833-72cc7f7e
                  - generic [ref=f1e259]: Подготовка
                - button "РАБОТА-1794229224057-2dba1a43 ТЕСТ-1794229223836-61a73563 Выполнение работы" [ref=f1e260] [cursor=pointer]:
                  - generic [ref=f1e261]: РАБОТА-1794229224057-2dba1a43
                  - generic [ref=f1e262]: ТЕСТ-1794229223836-61a73563
                  - generic [ref=f1e263]: Выполнение работы
                - button "РАБОТА-1794229248799-1a658eb7 ТЕСТ-1794229248613-cddfd9ae Выполнение работы" [ref=f1e264] [cursor=pointer]:
                  - generic [ref=f1e265]: РАБОТА-1794229248799-1a658eb7
                  - generic [ref=f1e266]: ТЕСТ-1794229248613-cddfd9ae
                  - generic [ref=f1e267]: Выполнение работы
                - button "РАБОТА-1794229285385-99eee4a8 ТЕСТ-1794229285189-6b5835d9 Выполнение работы" [ref=f1e268] [cursor=pointer]:
                  - generic [ref=f1e269]: РАБОТА-1794229285385-99eee4a8
                  - generic [ref=f1e270]: ТЕСТ-1794229285189-6b5835d9
                  - generic [ref=f1e271]: Выполнение работы
                - button "РАБОТА-1794229312905-7261862f ТЕСТ-1794229312690-be4d5d9b Выполнение работы" [ref=f1e272] [cursor=pointer]:
                  - generic [ref=f1e273]: РАБОТА-1794229312905-7261862f
                  - generic [ref=f1e274]: ТЕСТ-1794229312690-be4d5d9b
                  - generic [ref=f1e275]: Выполнение работы
                - button "РАБОТА-1794229364220-fa516209 ТЕСТ-1794229364020-139a1b52 Выполнение работы" [ref=f1e276] [cursor=pointer]:
                  - generic [ref=f1e277]: РАБОТА-1794229364220-fa516209
                  - generic [ref=f1e278]: ТЕСТ-1794229364020-139a1b52
                  - generic [ref=f1e279]: Выполнение работы
                - button "РАБОТА-1794229402431-285ff2c7 ТЕСТ-1794229402238-1646ada8 Выполнение работы" [ref=f1e280] [cursor=pointer]:
                  - generic [ref=f1e281]: РАБОТА-1794229402431-285ff2c7
                  - generic [ref=f1e282]: ТЕСТ-1794229402238-1646ada8
                  - generic [ref=f1e283]: Выполнение работы
                - button "РАБОТА-1794229439905-cd3ce883 ТЕСТ-1794229439712-c9903bcc Выполнение работы" [ref=f1e284] [cursor=pointer]:
                  - generic [ref=f1e285]: РАБОТА-1794229439905-cd3ce883
                  - generic [ref=f1e286]: ТЕСТ-1794229439712-c9903bcc
                  - generic [ref=f1e287]: Выполнение работы
                - button "РАБОТА-1794229527682-0d7b5a08 ТЕСТ-1794229527461-edd0410e Выполнение работы" [ref=f1e288] [cursor=pointer]:
                  - generic [ref=f1e289]: РАБОТА-1794229527682-0d7b5a08
                  - generic [ref=f1e290]: ТЕСТ-1794229527461-edd0410e
                  - generic [ref=f1e291]: Выполнение работы
                - button "РАБОТА-1794230026089-817309a2 ТЕСТ-1794230025899-b0f7f949 Выполнение работы" [ref=f1e292] [cursor=pointer]:
                  - generic [ref=f1e293]: РАБОТА-1794230026089-817309a2
                  - generic [ref=f1e294]: ТЕСТ-1794230025899-b0f7f949
                  - generic [ref=f1e295]: Выполнение работы
                - button "РАБОТА-1794230045496-11035e25 ТЕСТ-1794230045300-b5fb6327 Выполнение работы" [ref=f1e296] [cursor=pointer]:
                  - generic [ref=f1e297]: РАБОТА-1794230045496-11035e25
                  - generic [ref=f1e298]: ТЕСТ-1794230045300-b5fb6327
                  - generic [ref=f1e299]: Выполнение работы
                - button "РАБОТА-1794230112810-b1850b7a ТЕСТ-1794230112562-40604e9e Выполнение работы" [ref=f1e300] [cursor=pointer]:
                  - generic [ref=f1e301]: РАБОТА-1794230112810-b1850b7a
                  - generic [ref=f1e302]: ТЕСТ-1794230112562-40604e9e
                  - generic [ref=f1e303]: Выполнение работы
                - button "РАБОТА-1794230169686-56a99ba6 ТЕСТ-1794230169495-d0f21adf Выполнение работы" [ref=f1e304] [cursor=pointer]:
                  - generic [ref=f1e305]: РАБОТА-1794230169686-56a99ba6
                  - generic [ref=f1e306]: ТЕСТ-1794230169495-d0f21adf
                  - generic [ref=f1e307]: Выполнение работы
                - button "РАБОТА-1794230289407-31516c17 ТЕСТ-1794230289213-4eb46f70 Выполнение работы" [ref=f1e308] [cursor=pointer]:
                  - generic [ref=f1e309]: РАБОТА-1794230289407-31516c17
                  - generic [ref=f1e310]: ТЕСТ-1794230289213-4eb46f70
                  - generic [ref=f1e311]: Выполнение работы
                - button "РАБОТА-1794230319755-9de45e62 ТЕСТ-1794230319571-408483b2 Выполнение работы" [ref=f1e312] [cursor=pointer]:
                  - generic [ref=f1e313]: РАБОТА-1794230319755-9de45e62
                  - generic [ref=f1e314]: ТЕСТ-1794230319571-408483b2
                  - generic [ref=f1e315]: Выполнение работы
                - button "РАБОТА-1794250184392-8d7af1b0 ТЕСТ-1794250184133-b98bd0e0 Выполнение работы" [ref=f1e316] [cursor=pointer]:
                  - generic [ref=f1e317]: РАБОТА-1794250184392-8d7af1b0
                  - generic [ref=f1e318]: ТЕСТ-1794250184133-b98bd0e0
                  - generic [ref=f1e319]: Выполнение работы
                - button "РАБОТА-1794250729732-3edc8eec ТЕСТ-1794250729505-f9d181b4 Подготовка" [ref=f1e320] [cursor=pointer]:
                  - generic [ref=f1e321]: РАБОТА-1794250729732-3edc8eec
                  - generic [ref=f1e322]: ТЕСТ-1794250729505-f9d181b4
                  - generic [ref=f1e323]: Подготовка
                - button "РАБОТА-1794251363045-8f55dcee ТЕСТ-1794251362977-e1a165e7 Подготовка" [ref=f1e324] [cursor=pointer]:
                  - generic [ref=f1e325]: РАБОТА-1794251363045-8f55dcee
                  - generic [ref=f1e326]: ТЕСТ-1794251362977-e1a165e7
                  - generic [ref=f1e327]: Подготовка
                - button "РАБОТА-1794251363181-b397ed64 ТЕСТ-1794251363071-254c5154 Подготовка" [ref=f1e328] [cursor=pointer]:
                  - generic [ref=f1e329]: РАБОТА-1794251363181-b397ed64
                  - generic [ref=f1e330]: ТЕСТ-1794251363071-254c5154
                  - generic [ref=f1e331]: Подготовка
                - button "РАБОТА-1794251363623-025683cc ТЕСТ-1794251363561-3241246c Подготовка" [ref=f1e332] [cursor=pointer]:
                  - generic [ref=f1e333]: РАБОТА-1794251363623-025683cc
                  - generic [ref=f1e334]: ТЕСТ-1794251363561-3241246c
                  - generic [ref=f1e335]: Подготовка
                - button "РАБОТА-1794251364591-cb8f6dc2 ТЕСТ-1794251364526-1ec55814 Выполнение работы" [ref=f1e336] [cursor=pointer]:
                  - generic [ref=f1e337]: РАБОТА-1794251364591-cb8f6dc2
                  - generic [ref=f1e338]: ТЕСТ-1794251364526-1ec55814
                  - generic [ref=f1e339]: Выполнение работы
          - generic [ref=f1e341]:
            - heading "О работе" [level=3] [ref=f1e343]
            - generic [ref=f1e345]:
              - generic [ref=f1e346]:
                - generic [ref=f1e347]: Код проекта
                - generic "ТЕСТ-1794251363561-3241246c" [ref=f1e348]
              - generic [ref=f1e349]:
                - generic [ref=f1e350]: Название
                - generic "РАБОТА-1794251363623-025683cc" [ref=f1e351]
              - generic [ref=f1e352]:
                - generic [ref=f1e353]: Компания
                - generic [ref=f1e354]: ООО ЕХСЗ-2 (ЕвроХим Северо-Запад - 2)
              - generic [ref=f1e355]:
                - generic [ref=f1e356]:
                  - generic [ref=f1e357]: Начало командировок
                  - generic [ref=f1e358]:
                    - text: 10-11-2026
                    - button "" [ref=f1e359] [cursor=pointer]
                - generic [ref=f1e361]:
                  - generic [ref=f1e362]: Окончание коман-вок
                  - generic [ref=f1e363]:
                    - text: 09-02-2027
                    - button "" [ref=f1e364] [cursor=pointer]
              - generic [ref=f1e366]:
                - generic [ref=f1e367]: Статус
                - generic [ref=f1e368]: Подготовка
              - generic [ref=f1e369]:
                - generic [ref=f1e370]:
                  - generic [ref=f1e371]: Необходимо
                  - generic [ref=f1e372]:
                    - generic [ref=f1e373]: 10 спец.
                    - button "" [ref=f1e374] [cursor=pointer]
                - generic [ref=f1e376]:
                  - generic [ref=f1e377]: Участвуют
                  - generic [ref=f1e378]: 0 спец.
          - generic [ref=f1e380]:
            - generic [ref=f1e381]:
              - heading "Доступный персонал" [level=3] [ref=f1e382]
              - generic [ref=f1e383]: 141 чел.
            - generic [ref=f1e385]:
              - textbox "Кого ищем?" [ref=f1e387]
              - generic [ref=f1e388]:
                - generic [ref=f1e389]:
                  - generic [ref=f1e390]: Алексеенко Николай Владимирович
                  - button "+" [ref=f1e392] [cursor=pointer]
                - generic [ref=f1e394]:
                  - generic [ref=f1e395]: Андреев Андрей _
                  - button "+" [ref=f1e397] [cursor=pointer]
                - generic [ref=f1e399]:
                  - generic [ref=f1e400]: Бабушкин Александр Владимирович
                  - button "+" [ref=f1e402] [cursor=pointer]
                - generic [ref=f1e404]:
                  - generic [ref=f1e405]: Базаев Таймураз Муратович
                  - button "+" [ref=f1e407] [cursor=pointer]
                - generic [ref=f1e409]:
                  - generic [ref=f1e410]: Башин Юрий Александрович
                  - button "+" [ref=f1e412] [cursor=pointer]
                - generic [ref=f1e414]:
                  - generic [ref=f1e415]: Бектемиров Каиргельды Капкаевич
                  - button "+" [ref=f1e417] [cursor=pointer]
                - generic [ref=f1e419]:
                  - generic [ref=f1e420]: Бекшенов Жандос _
                  - button "+" [ref=f1e422] [cursor=pointer]
                - generic [ref=f1e424]:
                  - generic [ref=f1e425]: Бикеев Антон Алексеевич
                  - button "+" [ref=f1e427] [cursor=pointer]
                - generic [ref=f1e429]:
                  - generic [ref=f1e430]: Борисов Роман Янович
                  - button "+" [ref=f1e432] [cursor=pointer]
                - generic [ref=f1e434]:
                  - generic [ref=f1e435]: Боровиков Павел Валерьевич
                  - button "+" [ref=f1e437] [cursor=pointer]
                - generic [ref=f1e439]:
                  - generic [ref=f1e440]: Брынзей Богдан Васильевич
                  - button "+" [ref=f1e442] [cursor=pointer]
                - generic [ref=f1e444]:
                  - generic [ref=f1e445]: Бузовский Никита
                  - button "+" [ref=f1e447] [cursor=pointer]
                - generic [ref=f1e449]:
                  - generic [ref=f1e450]: Бычков Алексей Анатольевич
                  - button "+" [ref=f1e452] [cursor=pointer]
                - generic [ref=f1e454]:
                  - generic [ref=f1e455]: Ванюков Павел Сергеевич
                  - button "+" [ref=f1e457] [cursor=pointer]
                - generic [ref=f1e459]:
                  - generic [ref=f1e460]: Веснин Андрей _
                  - button "+" [ref=f1e462] [cursor=pointer]
                - generic [ref=f1e464]:
                  - generic [ref=f1e465]: Виесис Артём
                  - button "+" [ref=f1e467] [cursor=pointer]
                - generic [ref=f1e469]:
                  - generic [ref=f1e470]: Волков Артём _
                  - button "+" [ref=f1e472] [cursor=pointer]
                - generic [ref=f1e474]:
                  - generic [ref=f1e475]: Гаврилов Александр Юрьевич
                  - button "+" [ref=f1e477] [cursor=pointer]
                - generic [ref=f1e479]:
                  - generic [ref=f1e480]: Галимов Игорь
                  - button "+" [ref=f1e482] [cursor=pointer]
                - generic [ref=f1e484]:
                  - generic [ref=f1e485]: Гарьковец Евгений Игоревич
                  - button "+" [ref=f1e487] [cursor=pointer]
                - generic [ref=f1e489]:
                  - generic [ref=f1e490]: Годун Александр
                  - button "+" [ref=f1e492] [cursor=pointer]
                - generic [ref=f1e494]:
                  - generic [ref=f1e495]: Гоменюк Роман Владимирович
                  - button "+" [ref=f1e497] [cursor=pointer]
                - generic [ref=f1e499]:
                  - generic [ref=f1e500]: Григорьевский Антон Евгеньевич
                  - button "+" [ref=f1e502] [cursor=pointer]
                - generic [ref=f1e504]:
                  - generic [ref=f1e505]: Гришин Илья Владимирович
                  - button "+" [ref=f1e507] [cursor=pointer]
                - generic [ref=f1e509]:
                  - generic [ref=f1e510]: Гудков Максим
                  - button "+" [ref=f1e512] [cursor=pointer]
                - generic [ref=f1e514]:
                  - generic [ref=f1e515]: Гуторов Роман Анатольевич
                  - button "+" [ref=f1e517] [cursor=pointer]
                - generic [ref=f1e519]:
                  - generic [ref=f1e520]: Давыдов Павел Викторович
                  - button "+" [ref=f1e522] [cursor=pointer]
                - generic [ref=f1e524]:
                  - generic [ref=f1e525]: Данилов Игорь Михайлович
                  - button "+" [ref=f1e527] [cursor=pointer]
                - generic [ref=f1e529]:
                  - generic [ref=f1e530]: Демков Антон Владимирович
                  - button "+" [ref=f1e532] [cursor=pointer]
                - generic [ref=f1e534]:
                  - generic [ref=f1e535]: Евдокимов Даниил
                  - button "+" [ref=f1e537] [cursor=pointer]
                - generic [ref=f1e539]:
                  - generic [ref=f1e540]: Ефимов Валерий Владимирович
                  - button "+" [ref=f1e542] [cursor=pointer]
                - generic [ref=f1e544]:
                  - generic [ref=f1e545]: Жилин Геннадий Николаевич
                  - button "+" [ref=f1e547] [cursor=pointer]
                - generic [ref=f1e549]:
                  - generic [ref=f1e550]: Запольнов Юрий Николаевич
                  - button "+" [ref=f1e552] [cursor=pointer]
                - generic [ref=f1e554]:
                  - generic [ref=f1e555]: Заяц Денис _
                  - button "+" [ref=f1e557] [cursor=pointer]
                - generic [ref=f1e559]:
                  - generic [ref=f1e560]: Зимнухов Виталий Иванович
                  - button "+" [ref=f1e562] [cursor=pointer]
                - generic [ref=f1e564]:
                  - generic [ref=f1e565]: Зиновьев Александр Вячеславович
                  - button "+" [ref=f1e567] [cursor=pointer]
                - generic [ref=f1e569]:
                  - generic [ref=f1e570]: Зыкин Валерий _
                  - button "+" [ref=f1e572] [cursor=pointer]
                - generic [ref=f1e574]:
                  - generic [ref=f1e575]: Ибрагимов Ренат Асхатович
                  - button "+" [ref=f1e577] [cursor=pointer]
                - generic [ref=f1e579]:
                  - generic [ref=f1e580]: Иноземцев Артем Геннадьевич
                  - button "+" [ref=f1e582] [cursor=pointer]
                - generic [ref=f1e584]:
                  - generic [ref=f1e585]: Исабеков Акылбек Мухтарович
                  - button "+" [ref=f1e587] [cursor=pointer]
                - generic [ref=f1e589]:
                  - generic [ref=f1e590]: Искаков Таныр
                  - button "+" [ref=f1e592] [cursor=pointer]
                - generic [ref=f1e594]:
                  - generic [ref=f1e595]: Каппаров Жанат Уасиханович
                  - button "+" [ref=f1e597] [cursor=pointer]
                - generic [ref=f1e599]:
                  - generic [ref=f1e600]: Катруца Александр Николаевич
                  - button "+" [ref=f1e602] [cursor=pointer]
                - generic [ref=f1e604]:
                  - generic [ref=f1e605]: Кашкенов Ербол Казымович
                  - button "+" [ref=f1e607] [cursor=pointer]
                - generic [ref=f1e609]:
                  - generic [ref=f1e610]: Кириченко Максим
                  - button "+" [ref=f1e612] [cursor=pointer]
                - generic [ref=f1e614]:
                  - generic [ref=f1e615]: Киселев Алексей _
                  - button "+" [ref=f1e617] [cursor=pointer]
                - generic [ref=f1e619]:
                  - generic [ref=f1e620]: Киселев Сергей Викторович
                  - button "+" [ref=f1e622] [cursor=pointer]
                - generic [ref=f1e624]:
                  - generic [ref=f1e625]: Клецков Андрей
                  - button "+" [ref=f1e627] [cursor=pointer]
                - generic [ref=f1e629]:
                  - generic [ref=f1e630]: Когдов Михаил Иванович
                  - button "+" [ref=f1e632] [cursor=pointer]
                - generic [ref=f1e634]:
                  - generic [ref=f1e635]: Козлов Александр Валентинович
                  - button "+" [ref=f1e637] [cursor=pointer]
                - generic [ref=f1e639]:
                  - generic [ref=f1e640]: Козлов Роман Александрович
                  - button "+" [ref=f1e642] [cursor=pointer]
                - generic [ref=f1e644]:
                  - generic [ref=f1e645]: Косенко Игорь
                  - button "+" [ref=f1e647] [cursor=pointer]
                - generic [ref=f1e649]:
                  - generic [ref=f1e650]: Кругов Степан Алексеевич
                  - button "+" [ref=f1e652] [cursor=pointer]
                - generic [ref=f1e654]:
                  - generic [ref=f1e655]: Кряжев Даниил Павлович
                  - button "+" [ref=f1e657] [cursor=pointer]
                - generic [ref=f1e659]:
                  - generic [ref=f1e660]: Кудайкул Ракым Кайратулы
                  - button "+" [ref=f1e662] [cursor=pointer]
                - generic [ref=f1e664]:
                  - generic [ref=f1e665]: Кудрев Николай Михайлович
                  - button "+" [ref=f1e667] [cursor=pointer]
                - generic [ref=f1e669]:
                  - generic [ref=f1e670]: Кузнецов Николай Александрович
                  - button "+" [ref=f1e672] [cursor=pointer]
                - generic [ref=f1e674]:
                  - generic [ref=f1e675]: Кузнецов Олег Владимирович
                  - button "+" [ref=f1e677] [cursor=pointer]
                - generic [ref=f1e679]:
                  - generic [ref=f1e680]: Кузьмин Александр Сергеевич
                  - button "+" [ref=f1e682] [cursor=pointer]
                - generic [ref=f1e684]:
                  - generic [ref=f1e685]: Куис Игорь Викторович
                  - button "+" [ref=f1e687] [cursor=pointer]
                - generic [ref=f1e689]:
                  - generic [ref=f1e690]: Кулбалиев Тимур _
                  - button "+" [ref=f1e692] [cursor=pointer]
                - generic [ref=f1e694]:
                  - generic [ref=f1e695]: Курман Дамир Каержанулы
                  - button "+" [ref=f1e697] [cursor=pointer]
                - generic [ref=f1e699]:
                  - generic [ref=f1e700]: Курышев Богдан Николаевич
                  - button "+" [ref=f1e702] [cursor=pointer]
                - generic [ref=f1e704]:
                  - generic [ref=f1e705]: Кызылкаипов Ергали Рамазанович
                  - button "+" [ref=f1e707] [cursor=pointer]
                - generic [ref=f1e709]:
                  - generic [ref=f1e710]: Лазарев Илья Андреевич
                  - button "+" [ref=f1e712] [cursor=pointer]
                - generic [ref=f1e714]:
                  - generic [ref=f1e715]: Лебедев Сергей Александрович
                  - button "+" [ref=f1e717] [cursor=pointer]
                - generic [ref=f1e719]:
                  - generic [ref=f1e720]: Литвиненко Олег Геннадиевич
                  - button "+" [ref=f1e722] [cursor=pointer]
                - generic [ref=f1e724]:
                  - generic [ref=f1e725]: Лозбяков Александр Александрович
                  - button "+" [ref=f1e727] [cursor=pointer]
                - generic [ref=f1e729]:
                  - generic [ref=f1e730]: Ломов Дмитрий Александрович
                  - button "+" [ref=f1e732] [cursor=pointer]
                - generic [ref=f1e734]:
                  - generic [ref=f1e735]: Лопатченко Степан Алексеевич
                  - button "+" [ref=f1e737] [cursor=pointer]
                - generic [ref=f1e739]:
                  - generic [ref=f1e740]: Лужбинин Юрий Владимирович
                  - button "+" [ref=f1e742] [cursor=pointer]
                - generic [ref=f1e744]:
                  - generic [ref=f1e745]: Лущай Владислав
                  - button "+" [ref=f1e747] [cursor=pointer]
                - generic [ref=f1e749]:
                  - generic [ref=f1e750]: Максимов Роман Сергеевич
                  - button "+" [ref=f1e752] [cursor=pointer]
                - generic [ref=f1e754]:
                  - generic [ref=f1e755]: Мамонов Андрей Александрович
                  - button "+" [ref=f1e757] [cursor=pointer]
                - generic [ref=f1e759]:
                  - generic [ref=f1e760]: Мандриков Артём Александрович
                  - button "+" [ref=f1e762] [cursor=pointer]
                - generic [ref=f1e764]:
                  - generic [ref=f1e765]: Мартынов Андрей Геннадьевич
                  - button "+" [ref=f1e767] [cursor=pointer]
                - generic [ref=f1e769]:
                  - generic [ref=f1e770]: Масягутов Рафаэль Зиннурович
                  - button "+" [ref=f1e772] [cursor=pointer]
                - generic [ref=f1e774]:
                  - generic [ref=f1e775]: Мещеряков Александр Васильевич
                  - button "+" [ref=f1e777] [cursor=pointer]
                - generic [ref=f1e779]:
                  - generic [ref=f1e780]: Михайлов Евгений Леонидович
                  - button "+" [ref=f1e782] [cursor=pointer]
                - generic [ref=f1e784]:
                  - generic [ref=f1e785]: Михеев Роман Евгеньевич
                  - button "+" [ref=f1e787] [cursor=pointer]
                - generic [ref=f1e789]:
                  - generic [ref=f1e790]: Моторин Дмитрий Максимович
                  - button "+" [ref=f1e792] [cursor=pointer]
                - generic [ref=f1e794]:
                  - generic [ref=f1e795]: Мукашев Ермек Нуренович
                  - button "+" [ref=f1e797] [cursor=pointer]
                - generic [ref=f1e799]:
                  - generic [ref=f1e800]: Мусин Михаил
                  - button "+" [ref=f1e802] [cursor=pointer]
                - generic [ref=f1e804]:
                  - generic [ref=f1e805]: Мухамедьяров Талгат
                  - button "+" [ref=f1e807] [cursor=pointer]
                - generic [ref=f1e809]:
                  - generic [ref=f1e810]: Насыров Шамиль Хабирович
                  - button "+" [ref=f1e812] [cursor=pointer]
                - generic [ref=f1e814]:
                  - generic [ref=f1e815]: Нежеря Арина
                  - button "+" [ref=f1e817] [cursor=pointer]
                - generic [ref=f1e819]:
                  - generic [ref=f1e820]: Нежеря Родион
                  - button "+" [ref=f1e822] [cursor=pointer]
                - generic [ref=f1e824]:
                  - generic [ref=f1e825]: Нестеренко Вадим
                  - button "+" [ref=f1e827] [cursor=pointer]
                - generic [ref=f1e829]:
                  - generic [ref=f1e830]: Низамиев Данис Рамисович
                  - button "+" [ref=f1e832] [cursor=pointer]
                - generic [ref=f1e834]:
                  - generic [ref=f1e835]: Никитин Максим Леонидович
                  - button "+" [ref=f1e837] [cursor=pointer]
                - generic [ref=f1e839]:
                  - generic [ref=f1e840]: Носовец Алексей Юрьевич
                  - button "+" [ref=f1e842] [cursor=pointer]
                - generic [ref=f1e844]:
                  - generic [ref=f1e845]: Нургалиев Ильдар Тимершевич
                  - button "+" [ref=f1e847] [cursor=pointer]
                - generic [ref=f1e849]:
                  - generic [ref=f1e850]: Нургалиев Ренат Тимершанович
                  - button "+" [ref=f1e852] [cursor=pointer]
                - generic [ref=f1e854]:
                  - generic [ref=f1e855]: Нуркин Данияр Маулитович
                  - button "+" [ref=f1e857] [cursor=pointer]
                - generic [ref=f1e859]:
                  - generic [ref=f1e860]: Овчинников Михаил Иннокентьевич
                  - button "+" [ref=f1e862] [cursor=pointer]
                - generic [ref=f1e864]:
                  - generic [ref=f1e865]: Осипчук Валерий Сергеевич
                  - button "+" [ref=f1e867] [cursor=pointer]
                - generic [ref=f1e869]:
                  - generic [ref=f1e870]: Охвайс Милана Игоревна
                  - button "+" [ref=f1e872] [cursor=pointer]
                - generic [ref=f1e874]:
                  - generic [ref=f1e875]: Павлов Андрей Анатольевич
                  - button "+" [ref=f1e877] [cursor=pointer]
                - generic [ref=f1e879]:
                  - generic [ref=f1e880]: Пасюк Игорь _
                  - button "+" [ref=f1e882] [cursor=pointer]
                - generic [ref=f1e884]:
                  - generic [ref=f1e885]: Пашковский Павел Андреевич
                  - button "+" [ref=f1e887] [cursor=pointer]
                - generic [ref=f1e889]:
                  - generic [ref=f1e890]: Пензев Сергей _
                  - button "+" [ref=f1e892] [cursor=pointer]
                - generic [ref=f1e894]:
                  - generic [ref=f1e895]: Пестов Илья Андреевич
                  - button "+" [ref=f1e897] [cursor=pointer]
                - generic [ref=f1e899]:
                  - generic [ref=f1e900]: Писковец Алексей _
                  - button "+" [ref=f1e902] [cursor=pointer]
                - generic [ref=f1e904]:
                  - generic [ref=f1e905]: Плющенко Матвей Владимирович
                  - button "+" [ref=f1e907] [cursor=pointer]
                - generic [ref=f1e909]:
                  - generic [ref=f1e910]: Поварешкин Андрей Владимирович
                  - button "+" [ref=f1e912] [cursor=pointer]
                - generic [ref=f1e914]:
                  - generic [ref=f1e915]: Погожев Евгений Александрович
                  - button "+" [ref=f1e917] [cursor=pointer]
                - generic [ref=f1e919]:
                  - generic [ref=f1e920]: Почечуев Евгений Геннадьевич
                  - button "+" [ref=f1e922] [cursor=pointer]
                - generic [ref=f1e924]:
                  - generic [ref=f1e925]: Пронина Марина Владимировна
                  - button "+" [ref=f1e927] [cursor=pointer]
                - generic [ref=f1e929]:
                  - generic [ref=f1e930]: Рогоза Алексей
                  - button "+" [ref=f1e932] [cursor=pointer]
                - generic [ref=f1e934]:
                  - generic [ref=f1e935]: Сакибаев Игорь Владимирович
                  - button "+" [ref=f1e937] [cursor=pointer]
                - generic [ref=f1e939]:
                  - generic [ref=f1e940]: Сеитов Ермек _
                  - button "+" [ref=f1e942] [cursor=pointer]
                - generic [ref=f1e944]:
                  - generic [ref=f1e945]: Селезнев Максим Павлович
                  - button "+" [ref=f1e947] [cursor=pointer]
                - generic [ref=f1e949]:
                  - generic [ref=f1e950]: Сланов Алишер Ойратович
                  - button "+" [ref=f1e952] [cursor=pointer]
                - generic [ref=f1e954]:
                  - generic [ref=f1e955]: Случевский Сергей Анатольевич
                  - button "+" [ref=f1e957] [cursor=pointer]
                - generic [ref=f1e959]:
                  - generic [ref=f1e960]: Смородин Сергей Анатольевич
                  - button "+" [ref=f1e962] [cursor=pointer]
                - generic [ref=f1e964]:
                  - generic [ref=f1e965]: Соловьев Иван Сергеевич
                  - button "+" [ref=f1e967] [cursor=pointer]
                - generic [ref=f1e969]:
                  - generic [ref=f1e970]: Сорокин Денис
                  - button "+" [ref=f1e972] [cursor=pointer]
                - generic [ref=f1e974]:
                  - generic [ref=f1e975]: Таньков Денис Геннадьевич
                  - button "+" [ref=f1e977] [cursor=pointer]
                - generic [ref=f1e979]:
                  - generic [ref=f1e980]: Таран Дмитрий _
                  - button "+" [ref=f1e982] [cursor=pointer]
                - generic [ref=f1e984]:
                  - generic [ref=f1e985]: Томильцев Максим
                  - button "+" [ref=f1e987] [cursor=pointer]
                - generic [ref=f1e989]:
                  - generic [ref=f1e990]: Трофимов Константин Алексеевич
                  - button "+" [ref=f1e992] [cursor=pointer]
                - generic [ref=f1e994]:
                  - generic [ref=f1e995]: Трубчанинов Кирилл
                  - button "+" [ref=f1e997] [cursor=pointer]
                - generic [ref=f1e999]:
                  - generic [ref=f1e1000]: Тыртышный Алексей _
                  - button "+" [ref=f1e1002] [cursor=pointer]
                - generic [ref=f1e1004]:
                  - generic [ref=f1e1005]: Фараджев Эльчин Ганимат Оглы
                  - button "+" [ref=f1e1007] [cursor=pointer]
                - generic [ref=f1e1009]:
                  - generic [ref=f1e1010]: Фарзалиев Артем Эльдарович
                  - button "+" [ref=f1e1012] [cursor=pointer]
                - generic [ref=f1e1014]:
                  - generic [ref=f1e1015]: Федоренко Александр
                  - button "+" [ref=f1e1017] [cursor=pointer]
                - generic [ref=f1e1019]:
                  - generic [ref=f1e1020]: Филипченков Николай Юрьевич
                  - button "+" [ref=f1e1022] [cursor=pointer]
                - generic [ref=f1e1024]:
                  - generic [ref=f1e1025]: Флегель Андрей
                  - button "+" [ref=f1e1027] [cursor=pointer]
                - generic [ref=f1e1029]:
                  - generic [ref=f1e1030]: Хоружев Дмитрий _
                  - button "+" [ref=f1e1032] [cursor=pointer]
                - generic [ref=f1e1034]:
                  - generic [ref=f1e1035]: Христовская Элина
                  - button "+" [ref=f1e1037] [cursor=pointer]
                - generic [ref=f1e1039]:
                  - generic [ref=f1e1040]: Хусаинов Евгений Олегович
                  - button "+" [ref=f1e1042] [cursor=pointer]
                - generic [ref=f1e1044]:
                  - generic [ref=f1e1045]: Чернецов Александр Юрьевич
                  - button "+" [ref=f1e1047] [cursor=pointer]
                - generic [ref=f1e1049]:
                  - generic [ref=f1e1050]: Шаблавин Евгений Андреевич
                  - button "+" [ref=f1e1052] [cursor=pointer]
                - generic [ref=f1e1054]:
                  - generic [ref=f1e1055]: Шальнов Вадим Валентинович
                  - button "+" [ref=f1e1057] [cursor=pointer]
                - generic [ref=f1e1059]:
                  - generic [ref=f1e1060]: Шапиро Александр Евгеньевич
                  - button "+" [ref=f1e1062] [cursor=pointer]
                - generic [ref=f1e1064]:
                  - generic [ref=f1e1065]: Шарипов Руслан
                  - button "+" [ref=f1e1067] [cursor=pointer]
                - generic [ref=f1e1069]:
                  - generic [ref=f1e1070]: Шевелёв Дмитрий Александрович
                  - button "+" [ref=f1e1072] [cursor=pointer]
                - generic [ref=f1e1074]:
                  - generic [ref=f1e1075]: Шерстюк Дмитрий Иванович
                  - button "+" [ref=f1e1077] [cursor=pointer]
                - generic [ref=f1e1079]:
                  - generic [ref=f1e1080]: Юрченко Сергей Николаевич
                  - button "+" [ref=f1e1082] [cursor=pointer]
                - generic [ref=f1e1084]:
                  - generic [ref=f1e1085]: Яковлев Евгений _
                  - button "+" [ref=f1e1087] [cursor=pointer]
                - generic [ref=f1e1089]:
                  - generic [ref=f1e1090]: Янбаев Рамиль Равилевич
                  - button "+" [ref=f1e1092] [cursor=pointer]
          - generic [ref=f1e1095]:
            - generic [ref=f1e1096]:
              - heading "Заявленный персонал" [level=3] [ref=f1e1097]
              - generic [ref=f1e1098]: 0 чел.
            - generic [ref=f1e1100]:
              - textbox "Поиск сотрудников..." [ref=f1e1103]
              - generic [ref=f1e1104]: Нет сотрудников на проекте
          - generic [ref=f1e1107]:
            - generic [ref=f1e1108]:
              - heading "Занятый персонал" [level=3] [ref=f1e1109]
              - generic [ref=f1e1110]: 22 чел.
            - generic [ref=f1e1112]:
              - textbox "Кого ищем?" [ref=f1e1115]
              - generic [ref=f1e1116]:
                - generic [ref=f1e1117]: ФИО
                - generic [ref=f1e1118]: Причина
                - generic [ref=f1e1119]: Период
              - generic:
                - generic [ref=f1e1120]:
                  - generic [ref=f1e1121]:
                    - generic [ref=f1e1122]: Аипов Айдын Жанатович
                    - button "+" [ref=f1e1127] [cursor=pointer]
                  - generic [ref=f1e1130]:
                    - generic [ref=f1e1131]: "Проект:"
                    - generic [ref=f1e1135]: 02-11-2026 - 18-11-2026
                - generic [ref=f1e1140]:
                  - generic [ref=f1e1141]:
                    - generic [ref=f1e1142]: Акулов Валерий Андреевич
                    - button "+" [ref=f1e1147] [cursor=pointer]
                  - generic [ref=f1e1150]:
                    - generic [ref=f1e1151]: "Проект:"
                    - generic [ref=f1e1155]: 10-11-2026 - 16-11-2026
                - generic [ref=f1e1160]:
                  - generic [ref=f1e1161]:
                    - generic [ref=f1e1162]: Алексеев Владимир Станиславович
                    - button "+" [ref=f1e1167] [cursor=pointer]
                  - generic [ref=f1e1170]:
                    - generic [ref=f1e1171]: "Проект:"
                    - generic [ref=f1e1175]: 03-11-2026 - 18-11-2026
                - generic [ref=f1e1180]:
                  - generic [ref=f1e1181]:
                    - generic [ref=f1e1182]: Алтаев Дильшат Мергенович
                    - button "+" [ref=f1e1187] [cursor=pointer]
                  - generic [ref=f1e1190]:
                    - generic [ref=f1e1191]: "Проект:"
                    - generic [ref=f1e1195]: 03-11-2026 - 18-11-2026
                - generic [ref=f1e1200]:
                  - generic [ref=f1e1201]:
                    - generic [ref=f1e1202]: Алябьев Игорь Олегович
                    - button "+" [ref=f1e1207] [cursor=pointer]
                  - generic [ref=f1e1210]:
                    - generic [ref=f1e1211]: "Проект:"
                    - generic [ref=f1e1215]: 10-11-2026 - 16-11-2026
                - generic [ref=f1e1220]:
                  - generic [ref=f1e1221]:
                    - generic [ref=f1e1222]: Андрюшин Антон Петрович
                    - button "+" [ref=f1e1227] [cursor=pointer]
                  - generic [ref=f1e1230]:
                    - generic [ref=f1e1231]: "Проект:"
                    - generic [ref=f1e1235]: 10-11-2026 - 20-11-2026
                - generic [ref=f1e1240]:
                  - generic [ref=f1e1241]:
                    - generic [ref=f1e1242]: Антонюк Андрей Владимирович
                    - button "+" [ref=f1e1247] [cursor=pointer]
                  - generic [ref=f1e1250]:
                    - generic [ref=f1e1251]: "Проект:"
                    - generic [ref=f1e1255]: 10-11-2026 - 20-11-2026
                - generic [ref=f1e1260]:
                  - generic [ref=f1e1261]:
                    - generic [ref=f1e1262]: Апанасик Александр Сергеевич
                    - button "+" [ref=f1e1267] [cursor=pointer]
                  - generic [ref=f1e1270]:
                    - generic [ref=f1e1271]: "Проект:"
                    - generic [ref=f1e1275]: 10-09-2026 - 01-02-2027
                - generic [ref=f1e1280]:
                  - generic [ref=f1e1281]:
                    - generic [ref=f1e1282]: Базо Станислав Максимович
                    - button "+" [ref=f1e1287] [cursor=pointer]
                  - generic [ref=f1e1290]:
                    - generic [ref=f1e1291]: "Проект:"
                    - generic [ref=f1e1295]: 29-10-2026 - 12-11-2026
                - generic [ref=f1e1300]:
                  - generic [ref=f1e1301]:
                    - generic [ref=f1e1302]: Батырбек Турар Канатулы
                    - button "+" [ref=f1e1307] [cursor=pointer]
                  - generic [ref=f1e1310]:
                    - generic [ref=f1e1311]: "Проект:"
                    - generic [ref=f1e1315]: 10-11-2026 - 20-11-2026
                - generic [ref=f1e1320]:
                  - generic [ref=f1e1321]:
                    - generic [ref=f1e1322]: Бацуев Константин Владиславович
                    - button "+" [ref=f1e1327] [cursor=pointer]
                  - generic [ref=f1e1330]:
                    - generic [ref=f1e1331]: "Проект:"
                    - generic [ref=f1e1335]: 10-11-2026 - 20-11-2026
                - generic [ref=f1e1340]:
                  - generic [ref=f1e1341]:
                    - generic [ref=f1e1342]: Белинский Павел Александрович
                    - button "+" [ref=f1e1347] [cursor=pointer]
                  - generic [ref=f1e1350]:
                    - generic [ref=f1e1351]: "Проект:"
                    - generic [ref=f1e1355]: 01-11-2026 - 20-11-2026
                - generic [ref=f1e1360]:
                  - generic [ref=f1e1361]:
                    - generic [ref=f1e1362]: Бондаренко Сергей Юрьевич
                    - button "+" [ref=f1e1367] [cursor=pointer]
                  - generic [ref=f1e1370]:
                    - generic [ref=f1e1371]: "Проект:"
                    - generic [ref=f1e1375]: 31-10-2026 - 15-11-2026
                - generic [ref=f1e1380]:
                  - generic [ref=f1e1381]:
                    - generic [ref=f1e1382]: Варин Дмитрий Борисович
                    - button "+" [ref=f1e1387] [cursor=pointer]
                  - generic [ref=f1e1390]:
                    - generic [ref=f1e1391]: "Проект:"
                    - generic [ref=f1e1395]: 30-10-2026 - 18-11-2026
                - generic [ref=f1e1400]:
                  - generic [ref=f1e1401]:
                    - generic [ref=f1e1402]: Ворошилов Александр Сергеевич
                    - button "+" [ref=f1e1407] [cursor=pointer]
                  - generic [ref=f1e1410]:
                    - generic [ref=f1e1411]: "Проект:"
                    - generic [ref=f1e1415]: 02-11-2026 - 19-11-2026
                - generic [ref=f1e1420]:
                  - generic [ref=f1e1421]:
                    - generic [ref=f1e1422]: Вульпе Александр Андреевич
                    - button "+" [ref=f1e1427] [cursor=pointer]
                  - generic [ref=f1e1430]:
                    - generic [ref=f1e1431]: "Проект:"
                    - generic [ref=f1e1435]: 02-11-2026 - 19-11-2026
                - generic [ref=f1e1440]:
                  - generic [ref=f1e1441]:
                    - generic [ref=f1e1442]: Вульпе Андрей Иванович
                    - button "+" [ref=f1e1447] [cursor=pointer]
                  - generic [ref=f1e1450]:
                    - generic [ref=f1e1451]: "Проект:"
                    - generic [ref=f1e1455]: 02-11-2026 - 19-11-2026
                - generic [ref=f1e1460]:
                  - generic [ref=f1e1461]:
                    - generic [ref=f1e1462]: Гафаров Руслан Рахимьянович
                    - button "+" [ref=f1e1467] [cursor=pointer]
                  - generic [ref=f1e1470]:
                    - generic [ref=f1e1471]: "Проект:"
                    - generic [ref=f1e1475]: 02-11-2026 - 19-11-2026
                - generic [ref=f1e1480]:
                  - generic [ref=f1e1481]:
                    - generic [ref=f1e1482]: Колесников Дмитрий Юрьевич
                    - button "+" [ref=f1e1487] [cursor=pointer]
                  - generic [ref=f1e1491]:
                    - generic [ref=f1e1493]: Отпуск по уходу за ребёнком
                    - generic [ref=f1e1494]: 08-06-2026 - 09-04-2029
                - generic [ref=f1e1495]:
                  - generic [ref=f1e1496]:
                    - generic [ref=f1e1497]: Подшивайлов Константин Иванович
                    - button "+" [ref=f1e1502] [cursor=pointer]
                  - generic [ref=f1e1506]:
                    - generic [ref=f1e1508]: Отпуск по уходу за ребёнком
                    - generic [ref=f1e1509]: 18-05-2026 - 22-02-2029
                - generic [ref=f1e1510]:
                  - generic [ref=f1e1511]:
                    - generic [ref=f1e1512]: Щёлоков Василий Владимирович
                    - button "+" [ref=f1e1517] [cursor=pointer]
                  - generic [ref=f1e1520]:
                    - generic [ref=f1e1521]: "Проект:"
                    - generic [ref=f1e1525]: 09-11-2026 - 20-11-2026
                - generic [ref=f1e1530]:
                  - generic [ref=f1e1531]:
                    - generic [ref=f1e1532]: Щёлоков Владимир Васильевич
                    - button "+" [ref=f1e1537] [cursor=pointer]
                  - generic [ref=f1e1540]:
                    - generic [ref=f1e1541]: "Проект:"
                    - generic [ref=f1e1545]: 09-11-2026 - 20-11-2026
        - generic [ref=f1e1551]:
          - generic [ref=f1e1552]:
            - 'heading "Портфель работ: загрузка по месяцам" [level=3] [ref=f1e1553]'
            - generic [ref=f1e1554]:
              - generic [ref=f1e1555]: 100%
              - generic [ref=f1e1557]: 75-99%
              - generic [ref=f1e1559]: 50-74%
              - generic [ref=f1e1561]: 25-49%
              - generic [ref=f1e1563]: <25%
          - generic [ref=f1e1565]:
            - generic [ref=f1e1566]:
              - generic [ref=f1e1567]: Работа
              - generic [ref=f1e1568]:
                - generic [ref=f1e1569]: сент. 25
                - generic [ref=f1e1570]: окт. 25
                - generic [ref=f1e1571]: нояб. 25
                - generic [ref=f1e1572]: дек. 25
                - generic [ref=f1e1573]: янв. 26
                - generic [ref=f1e1574]: фев. 26
                - generic [ref=f1e1575]: март 26
                - generic [ref=f1e1576]: апр. 26
                - generic [ref=f1e1577]: май 26
                - generic [ref=f1e1578]: июнь 26
                - generic [ref=f1e1579]: июль 26
                - generic [ref=f1e1580]: авг. 26
                - generic [ref=f1e1581]: сент. 26
                - generic [ref=f1e1582]: окт. 26
                - generic [ref=f1e1583]: нояб. 26
                - generic [ref=f1e1584]: дек. 26
                - generic [ref=f1e1585]: янв. 27
                - generic [ref=f1e1586]: фев. 27
              - generic [ref=f1e1587]: Всего
            - generic [ref=f1e1588] [cursor=pointer]:
              - generic [ref=f1e1590]:
                - generic "12321312321" [ref=f1e1591]
                - generic [ref=f1e1592]:
                  - generic [ref=f1e1593]: 2/1 чел.
                  - generic [ref=f1e1594]: 200%
              - generic [ref=f1e1595]: "2"
              - generic [ref=f1e1617]:
                - generic [ref=f1e1618]: 2 / 1
                - generic [ref=f1e1619]: 200%
            - generic [ref=f1e1620] [cursor=pointer]:
              - generic [ref=f1e1622]:
                - generic "2509_ОмскийНПЗ_С" [ref=f1e1623]
                - generic [ref=f1e1624]:
                  - generic [ref=f1e1625]: 19/19 чел.
                  - generic [ref=f1e1626]: 100%
              - generic [ref=f1e1627]:
                - generic [ref=f1e1628]: "2"
                - generic [ref=f1e1630]: "2"
                - generic [ref=f1e1632]: "2"
                - generic [ref=f1e1634]: "2"
                - generic [ref=f1e1636]: "2"
                - generic [ref=f1e1638]: "2"
                - generic [ref=f1e1640]: "2"
                - generic [ref=f1e1642]: "2"
                - generic [ref=f1e1644]: "2"
              - generic [ref=f1e1657]:
                - generic [ref=f1e1658]: 19 / 19
                - generic [ref=f1e1659]: 100%
            - generic [ref=f1e1660] [cursor=pointer]:
              - generic [ref=f1e1662]:
                - generic "2512_ЛукойлВНП_С (исключено)" [ref=f1e1663]
                - generic [ref=f1e1664]:
                  - generic [ref=f1e1665]: 7/21 чел.
                  - generic [ref=f1e1666]: 33%
              - generic [ref=f1e1667]:
                - generic [ref=f1e1672]: "1"
                - generic [ref=f1e1674]: "1"
                - generic [ref=f1e1676]: "1"
                - generic [ref=f1e1678]: "1"
                - generic [ref=f1e1680]: "1"
                - generic [ref=f1e1682]: "1"
                - generic [ref=f1e1684]: "1"
                - generic [ref=f1e1686]: "1"
              - generic [ref=f1e1696]:
                - generic [ref=f1e1697]: 7 / 21
                - generic [ref=f1e1698]: 33%
            - generic [ref=f1e1699] [cursor=pointer]:
              - generic [ref=f1e1701]:
                - generic "2512_ОЗСМ_С" [ref=f1e1702]
                - generic [ref=f1e1703]:
                  - generic [ref=f1e1704]: 2/0 чел.
                  - generic [ref=f1e1705]: 0%
              - generic [ref=f1e1706]:
                - generic [ref=f1e1710]: "1"
                - generic [ref=f1e1712]: "1"
                - generic [ref=f1e1714]: "1"
              - generic [ref=f1e1730]:
                - generic [ref=f1e1731]: 2 / 0
                - generic [ref=f1e1732]: 0%
            - generic [ref=f1e1733] [cursor=pointer]:
              - generic [ref=f1e1735]:
                - generic "2601_ОЗСМ_С" [ref=f1e1736]
                - generic [ref=f1e1737]:
                  - generic [ref=f1e1738]: 4/0 чел.
                  - generic [ref=f1e1739]: 0%
              - generic [ref=f1e1740]:
                - generic [ref=f1e1745]: "1"
                - generic [ref=f1e1747]: "1"
                - generic [ref=f1e1749]: "1"
                - generic [ref=f1e1751]: "1"
              - generic [ref=f1e1765]:
                - generic [ref=f1e1766]: 4 / 0
                - generic [ref=f1e1767]: 0%
            - generic [ref=f1e1768] [cursor=pointer]:
              - generic [ref=f1e1770]:
                - generic "2602_ЛИНК_С" [ref=f1e1771]
                - generic [ref=f1e1772]:
                  - generic [ref=f1e1773]: 21/83 чел.
                  - generic [ref=f1e1774]: 25%
              - generic [ref=f1e1775]:
                - generic [ref=f1e1782]: "11"
                - generic [ref=f1e1784]: "11"
              - generic [ref=f1e1798]:
                - generic [ref=f1e1799]: 21 / 83
                - generic [ref=f1e1800]: 25%
            - generic [ref=f1e1801] [cursor=pointer]:
              - generic [ref=f1e1803]:
                - generic "2602_МНПЗ_С" [ref=f1e1804]
                - generic [ref=f1e1805]:
                  - generic [ref=f1e1806]: 9/1 чел.
                  - generic [ref=f1e1807]: 900%
              - generic [ref=f1e1808]:
                - generic [ref=f1e1815]: "5"
                - generic [ref=f1e1817]: "5"
              - generic [ref=f1e1831]:
                - generic [ref=f1e1832]: 9 / 1
                - generic [ref=f1e1833]: 900%
            - generic [ref=f1e1834] [cursor=pointer]:
              - generic [ref=f1e1836]:
                - generic "2602_ОЗСМ_С" [ref=f1e1837]
                - generic [ref=f1e1838]:
                  - generic [ref=f1e1839]: 0/0 чел.
                  - generic [ref=f1e1840]: 0%
              - generic [ref=f1e1841]:
                - generic [ref=f1e1846]: "0"
                - generic [ref=f1e1848]: "0"
                - generic [ref=f1e1850]: "0"
              - generic [ref=f1e1865]:
                - generic [ref=f1e1866]: 0 / 0
                - generic [ref=f1e1867]: 0%
            - generic [ref=f1e1868] [cursor=pointer]:
              - generic [ref=f1e1870]:
                - generic "2602_ОмскийНПЗ_С" [ref=f1e1871]
                - generic [ref=f1e1872]:
                  - generic [ref=f1e1873]: 46/1 чел.
                  - generic [ref=f1e1874]: 4600%
              - generic [ref=f1e1875]:
                - generic [ref=f1e1881]: "9"
                - generic [ref=f1e1883]: "9"
                - generic [ref=f1e1885]: "9"
                - generic [ref=f1e1887]: "9"
                - generic [ref=f1e1889]: "9"
              - generic [ref=f1e1901]:
                - generic [ref=f1e1902]: 46 / 1
                - generic [ref=f1e1903]: 4600%
            - generic [ref=f1e1904] [cursor=pointer]:
              - generic [ref=f1e1906]:
                - generic "2603_МКран_С" [ref=f1e1907]
                - generic [ref=f1e1908]:
                  - generic [ref=f1e1909]: 2/1 чел.
                  - generic [ref=f1e1910]: 200%
              - generic [ref=f1e1911]: "2"
              - generic [ref=f1e1933]:
                - generic [ref=f1e1934]: 2 / 1
                - generic [ref=f1e1935]: 200%
            - generic [ref=f1e1936] [cursor=pointer]:
              - generic [ref=f1e1938]:
                - generic "2603_СС_ЛИНК_С" [ref=f1e1939]
                - generic [ref=f1e1940]:
                  - generic [ref=f1e1941]: 15/13 чел.
                  - generic [ref=f1e1942]: 115%
              - generic [ref=f1e1943]:
                - generic [ref=f1e1952]: "3"
                - generic [ref=f1e1954]: "3"
                - generic [ref=f1e1956]: "3"
                - generic [ref=f1e1958]: "3"
                - generic [ref=f1e1960]: "3"
                - generic [ref=f1e1962]: "3"
              - generic [ref=f1e1970]:
                - generic [ref=f1e1971]: 15 / 13
                - generic [ref=f1e1972]: 115%
            - generic [ref=f1e1973] [cursor=pointer]:
              - generic [ref=f1e1975]:
                - generic "2603_СС_ЛИНК_С_АВТ_5 (исключен)" [ref=f1e1976]
                - generic [ref=f1e1977]:
                  - generic [ref=f1e1978]: 7/7 чел.
                  - generic [ref=f1e1979]: 100%
              - generic [ref=f1e1980]:
                - generic [ref=f1e1990]: "4"
                - generic [ref=f1e1992]: "4"
              - generic [ref=f1e2003]:
                - generic [ref=f1e2004]: 7 / 7
                - generic [ref=f1e2005]: 100%
            - generic [ref=f1e2006] [cursor=pointer]:
              - generic [ref=f1e2008]:
                - generic "2603_Ставролен_С" [ref=f1e2009]
                - generic [ref=f1e2010]:
                  - generic [ref=f1e2011]: 2/1 чел.
                  - generic [ref=f1e2012]: 200%
              - generic [ref=f1e2013]: "2"
              - generic [ref=f1e2035]:
                - generic [ref=f1e2036]: 2 / 1
                - generic [ref=f1e2037]: 200%
            - generic [ref=f1e2038] [cursor=pointer]:
              - generic [ref=f1e2040]:
                - generic "2606_МНПЗ_Б_СупервайзингФС" [ref=f1e2041]
                - generic [ref=f1e2042]:
                  - generic [ref=f1e2043]: 2/2 чел.
                  - generic [ref=f1e2044]: 100%
              - generic [ref=f1e2045]:
                - generic [ref=f1e2058]: "1"
                - generic [ref=f1e2060]: "1"
                - generic [ref=f1e2062]: "1"
              - generic [ref=f1e2069]:
                - generic [ref=f1e2070]: 2 / 2
                - generic [ref=f1e2071]: 100%
            - generic [ref=f1e2072] [cursor=pointer]:
              - generic [ref=f1e2074]:
                - generic "2609_ОмскийНПЗ_СМР_Супервайзинг" [ref=f1e2075]
                - generic [ref=f1e2076]:
                  - generic [ref=f1e2077]: 3/1 чел.
                  - generic [ref=f1e2078]: 300%
              - generic [ref=f1e2079]:
                - generic [ref=f1e2092]: "1"
                - generic [ref=f1e2094]: "1"
                - generic [ref=f1e2096]: "1"
                - generic [ref=f1e2099]: "1"
              - generic [ref=f1e2104]:
                - generic [ref=f1e2105]: 3 / 1
                - generic [ref=f1e2106]: 300%
            - generic [ref=f1e2107] [cursor=pointer]:
              - generic [ref=f1e2109]:
                - generic "8ОКТЯБРЯ" [ref=f1e2110]
                - generic [ref=f1e2111]:
                  - generic [ref=f1e2112]: 6/1 чел.
                  - generic [ref=f1e2113]: 600%
              - generic [ref=f1e2114]: "6"
              - generic [ref=f1e2136]:
                - generic [ref=f1e2137]: 6 / 1
                - generic [ref=f1e2138]: 600%
            - generic [ref=f1e2139] [cursor=pointer]:
              - generic [ref=f1e2141]:
                - generic "home_work" [ref=f1e2142]
                - generic [ref=f1e2143]:
                  - generic [ref=f1e2144]: 5/5 чел.
                  - generic [ref=f1e2145]: 100%
              - generic [ref=f1e2146]:
                - generic [ref=f1e2159]: "2"
                - generic [ref=f1e2161]: "2"
                - generic [ref=f1e2163]: "2"
              - generic [ref=f1e2170]:
                - generic [ref=f1e2171]: 5 / 5
                - generic [ref=f1e2172]: 100%
            - generic [ref=f1e2173] [cursor=pointer]:
              - generic [ref=f1e2175]:
                - generic "Билеты" [ref=f1e2176]
                - generic [ref=f1e2177]:
                  - generic [ref=f1e2178]: 2/1 чел.
                  - generic [ref=f1e2179]: 200%
              - generic [ref=f1e2180]: "2"
              - generic [ref=f1e2202]:
                - generic [ref=f1e2203]: 2 / 1
                - generic [ref=f1e2204]: 200%
            - generic [ref=f1e2205] [cursor=pointer]:
              - generic [ref=f1e2207]:
                - generic "Выполнение работ по техническому контролю (супервайзинг); Руководитель - 468 чел.час. Супервайзер (14 чел.) - 6552 чел.час." [ref=f1e2208]
                - generic [ref=f1e2209]:
                  - generic [ref=f1e2210]: 0/3 чел.
                  - generic [ref=f1e2211]: 0%
              - generic [ref=f1e2212]:
                - generic [ref=f1e2225]: "0"
                - generic [ref=f1e2227]: "0"
              - generic [ref=f1e2235]:
                - generic [ref=f1e2236]: 0 / 3
                - generic [ref=f1e2237]: 0%
            - generic [ref=f1e2238] [cursor=pointer]:
              - generic [ref=f1e2240]:
                - generic "Инженерный (технический) контроль капитального ремонта; Руководитель - 451 чел.час. Супервайзер (2 чел.) - 902 чел.час." [ref=f1e2241]
                - generic [ref=f1e2242]:
                  - generic [ref=f1e2243]: 0/15 чел.
                  - generic [ref=f1e2244]: 0%
              - generic [ref=f1e2245]:
                - generic [ref=f1e2258]: "0"
                - generic [ref=f1e2260]: "0"
              - generic [ref=f1e2268]:
                - generic [ref=f1e2269]: 0 / 15
                - generic [ref=f1e2270]: 0%
            - generic [ref=f1e2271] [cursor=pointer]:
              - generic [ref=f1e2273]:
                - 'generic "КГПН УГК Производство №3 Супервайзинг фланцевых соединений Объем работ: 264 человеко-часов" [ref=f1e2274]'
                - generic [ref=f1e2275]:
                  - generic [ref=f1e2276]: 0/2 чел.
                  - generic [ref=f1e2277]: 0%
              - generic [ref=f1e2278]:
                - generic [ref=f1e2290]: "0"
                - generic [ref=f1e2292]: "0"
                - generic [ref=f1e2294]: "0"
                - generic [ref=f1e2296]: "0"
                - generic [ref=f1e2299]: "0"
              - generic [ref=f1e2304]:
                - generic [ref=f1e2305]: 0 / 2
                - generic [ref=f1e2306]: 0%
            - generic [ref=f1e2307] [cursor=pointer]:
              - generic [ref=f1e2309]:
                - generic "Композитная ремонтнаяя муфта, Standard, 10 кв.м, 200 мм - 5 шт. Фиксирующая лента 5х200 - 5 шт." [ref=f1e2310]
                - generic [ref=f1e2311]:
                  - generic [ref=f1e2312]: 0/2 чел.
                  - generic [ref=f1e2313]: 0%
              - generic [ref=f1e2314]:
                - generic [ref=f1e2326]: "0"
                - generic [ref=f1e2328]: "0"
              - generic [ref=f1e2337]:
                - generic [ref=f1e2338]: 0 / 2
                - generic [ref=f1e2339]: 0%
            - generic [ref=f1e2340] [cursor=pointer]:
              - generic [ref=f1e2342]:
                - generic "Оказание услуг технического контроля (супервайзинга) за сборкой фланцевых соединений" [ref=f1e2343]
                - generic [ref=f1e2344]:
                  - generic [ref=f1e2345]: 7/16 чел.
                  - generic [ref=f1e2346]: 43%
              - generic [ref=f1e2347]: "7"
              - generic [ref=f1e2369]:
                - generic [ref=f1e2370]: 7 / 16
                - generic [ref=f1e2371]: 43%
            - generic [ref=f1e2372] [cursor=pointer]:
              - generic [ref=f1e2374]:
                - generic "Планирование проверка" [ref=f1e2375]
                - generic [ref=f1e2376]:
                  - generic [ref=f1e2377]: 0/1 чел.
                  - generic [ref=f1e2378]: 0%
              - generic [ref=f1e2379]: "0"
              - generic [ref=f1e2401]:
                - generic [ref=f1e2402]: 0 / 1
                - generic [ref=f1e2403]: 0%
            - generic [ref=f1e2404] [cursor=pointer]:
              - generic [ref=f1e2406]:
                - generic "поехали" [ref=f1e2407]
                - generic [ref=f1e2408]:
                  - generic [ref=f1e2409]: 0/1 чел.
                  - generic [ref=f1e2410]: 0%
              - generic [ref=f1e2411]: "0"
              - generic [ref=f1e2433]:
                - generic [ref=f1e2434]: 0 / 1
                - generic [ref=f1e2435]: 0%
            - generic [ref=f1e2436] [cursor=pointer]:
              - generic [ref=f1e2438]:
                - generic "проверка табял" [ref=f1e2439]
                - generic [ref=f1e2440]:
                  - generic [ref=f1e2441]: 2/1 чел.
                  - generic [ref=f1e2442]: 200%
              - generic [ref=f1e2443]: "2"
              - generic [ref=f1e2465]:
                - generic [ref=f1e2466]: 2 / 1
                - generic [ref=f1e2467]: 200%
            - generic [ref=f1e2468] [cursor=pointer]:
              - generic [ref=f1e2470]:
                - generic "РАБОТА-1794228970921-dd89b455" [ref=f1e2471]
                - generic [ref=f1e2472]:
                  - generic [ref=f1e2473]: 0/10 чел.
                  - generic [ref=f1e2474]: 0%
              - generic [ref=f1e2475]:
                - generic [ref=f1e2490]: "0"
                - generic [ref=f1e2493]: "0"
                - generic [ref=f1e2495]: "0"
                - generic [ref=f1e2497]: "0"
              - generic [ref=f1e2500]:
                - generic [ref=f1e2501]: 0 / 10
                - generic [ref=f1e2502]: 0%
            - generic [ref=f1e2503] [cursor=pointer]:
              - generic [ref=f1e2505]:
                - generic "РАБОТА-1794229043405-0ab5ae0c" [ref=f1e2506]
                - generic [ref=f1e2507]:
                  - generic [ref=f1e2508]: 0/10 чел.
                  - generic [ref=f1e2509]: 0%
              - generic [ref=f1e2510]:
                - generic [ref=f1e2525]: "0"
                - generic [ref=f1e2528]: "0"
                - generic [ref=f1e2530]: "0"
                - generic [ref=f1e2532]: "0"
              - generic [ref=f1e2535]:
                - generic [ref=f1e2536]: 0 / 10
                - generic [ref=f1e2537]: 0%
            - generic [ref=f1e2538] [cursor=pointer]:
              - generic [ref=f1e2540]:
                - generic "РАБОТА-1794229064057-7edd33eb" [ref=f1e2541]
                - generic [ref=f1e2542]:
                  - generic [ref=f1e2543]: 2/10 чел.
                  - generic [ref=f1e2544]: 20%
              - generic [ref=f1e2545]:
                - generic [ref=f1e2560]: "1"
                - generic [ref=f1e2563]: "1"
                - generic [ref=f1e2565]: "1"
                - generic [ref=f1e2567]: "1"
              - generic [ref=f1e2570]:
                - generic [ref=f1e2571]: 2 / 10
                - generic [ref=f1e2572]: 20%
            - generic [ref=f1e2573] [cursor=pointer]:
              - generic [ref=f1e2575]:
                - generic "РАБОТА-1794229119046-e64ab88e" [ref=f1e2576]
                - generic [ref=f1e2577]:
                  - generic [ref=f1e2578]: 2/10 чел.
                  - generic [ref=f1e2579]: 20%
              - generic [ref=f1e2580]:
                - generic [ref=f1e2595]: "1"
                - generic [ref=f1e2598]: "1"
                - generic [ref=f1e2600]: "1"
                - generic [ref=f1e2602]: "1"
              - generic [ref=f1e2605]:
                - generic [ref=f1e2606]: 2 / 10
                - generic [ref=f1e2607]: 20%
            - generic [ref=f1e2608] [cursor=pointer]:
              - generic [ref=f1e2610]:
                - generic "РАБОТА-1794229224057-2dba1a43" [ref=f1e2611]
                - generic [ref=f1e2612]:
                  - generic [ref=f1e2613]: 2/10 чел.
                  - generic [ref=f1e2614]: 20%
              - generic [ref=f1e2615]:
                - generic [ref=f1e2630]: "1"
                - generic [ref=f1e2633]: "1"
                - generic [ref=f1e2635]: "1"
                - generic [ref=f1e2637]: "1"
              - generic [ref=f1e2640]:
                - generic [ref=f1e2641]: 2 / 10
                - generic [ref=f1e2642]: 20%
            - generic [ref=f1e2643] [cursor=pointer]:
              - generic [ref=f1e2645]:
                - generic "РАБОТА-1794229248799-1a658eb7" [ref=f1e2646]
                - generic [ref=f1e2647]:
                  - generic [ref=f1e2648]: 2/10 чел.
                  - generic [ref=f1e2649]: 20%
              - generic [ref=f1e2650]:
                - generic [ref=f1e2665]: "1"
                - generic [ref=f1e2668]: "1"
                - generic [ref=f1e2670]: "1"
                - generic [ref=f1e2672]: "1"
              - generic [ref=f1e2675]:
                - generic [ref=f1e2676]: 2 / 10
                - generic [ref=f1e2677]: 20%
            - generic [ref=f1e2678] [cursor=pointer]:
              - generic [ref=f1e2680]:
                - generic "РАБОТА-1794229285385-99eee4a8" [ref=f1e2681]
                - generic [ref=f1e2682]:
                  - generic [ref=f1e2683]: 2/10 чел.
                  - generic [ref=f1e2684]: 20%
              - generic [ref=f1e2685]:
                - generic [ref=f1e2700]: "1"
                - generic [ref=f1e2703]: "1"
                - generic [ref=f1e2705]: "1"
                - generic [ref=f1e2707]: "1"
              - generic [ref=f1e2710]:
                - generic [ref=f1e2711]: 2 / 10
                - generic [ref=f1e2712]: 20%
            - generic [ref=f1e2713] [cursor=pointer]:
              - generic [ref=f1e2715]:
                - generic "РАБОТА-1794229312905-7261862f" [ref=f1e2716]
                - generic [ref=f1e2717]:
                  - generic [ref=f1e2718]: 0/10 чел.
                  - generic [ref=f1e2719]: 0%
              - generic [ref=f1e2720]:
                - generic [ref=f1e2735]: "0"
                - generic [ref=f1e2738]: "0"
                - generic [ref=f1e2740]: "0"
                - generic [ref=f1e2742]: "0"
              - generic [ref=f1e2745]:
                - generic [ref=f1e2746]: 0 / 10
                - generic [ref=f1e2747]: 0%
            - generic [ref=f1e2748] [cursor=pointer]:
              - generic [ref=f1e2750]:
                - generic "РАБОТА-1794229364220-fa516209" [ref=f1e2751]
                - generic [ref=f1e2752]:
                  - generic [ref=f1e2753]: 0/10 чел.
                  - generic [ref=f1e2754]: 0%
              - generic [ref=f1e2755]:
                - generic [ref=f1e2770]: "0"
                - generic [ref=f1e2773]: "0"
                - generic [ref=f1e2775]: "0"
                - generic [ref=f1e2777]: "0"
              - generic [ref=f1e2780]:
                - generic [ref=f1e2781]: 0 / 10
                - generic [ref=f1e2782]: 0%
            - generic [ref=f1e2783] [cursor=pointer]:
              - generic [ref=f1e2785]:
                - generic "РАБОТА-1794229402431-285ff2c7" [ref=f1e2786]
                - generic [ref=f1e2787]:
                  - generic [ref=f1e2788]: 1/10 чел.
                  - generic [ref=f1e2789]: 10%
              - generic [ref=f1e2790]:
                - generic [ref=f1e2805]: "0"
                - generic [ref=f1e2808]: "0"
                - generic [ref=f1e2810]: "0"
                - generic [ref=f1e2812]: "0"
              - generic [ref=f1e2815]:
                - generic [ref=f1e2816]: 1 / 10
                - generic [ref=f1e2817]: 10%
            - generic [ref=f1e2818] [cursor=pointer]:
              - generic [ref=f1e2820]:
                - generic "РАБОТА-1794229439905-cd3ce883" [ref=f1e2821]
                - generic [ref=f1e2822]:
                  - generic [ref=f1e2823]: 0/10 чел.
                  - generic [ref=f1e2824]: 0%
              - generic [ref=f1e2825]:
                - generic [ref=f1e2840]: "0"
                - generic [ref=f1e2843]: "0"
                - generic [ref=f1e2845]: "0"
                - generic [ref=f1e2847]: "0"
              - generic [ref=f1e2850]:
                - generic [ref=f1e2851]: 0 / 10
                - generic [ref=f1e2852]: 0%
            - generic [ref=f1e2853] [cursor=pointer]:
              - generic [ref=f1e2855]:
                - generic "РАБОТА-1794229527682-0d7b5a08" [ref=f1e2856]
                - generic [ref=f1e2857]:
                  - generic [ref=f1e2858]: 3/10 чел.
                  - generic [ref=f1e2859]: 30%
              - generic [ref=f1e2860]:
                - generic [ref=f1e2875]: "1"
                - generic [ref=f1e2878]: "1"
                - generic [ref=f1e2880]: "1"
                - generic [ref=f1e2882]: "1"
              - generic [ref=f1e2885]:
                - generic [ref=f1e2886]: 3 / 10
                - generic [ref=f1e2887]: 30%
            - generic [ref=f1e2888] [cursor=pointer]:
              - generic [ref=f1e2890]:
                - generic "РАБОТА-1794230026089-817309a2" [ref=f1e2891]
                - generic [ref=f1e2892]:
                  - generic [ref=f1e2893]: 0/10 чел.
                  - generic [ref=f1e2894]: 0%
              - generic [ref=f1e2895]:
                - generic [ref=f1e2910]: "0"
                - generic [ref=f1e2913]: "0"
                - generic [ref=f1e2915]: "0"
                - generic [ref=f1e2917]: "0"
              - generic [ref=f1e2920]:
                - generic [ref=f1e2921]: 0 / 10
                - generic [ref=f1e2922]: 0%
            - generic [ref=f1e2923] [cursor=pointer]:
              - generic [ref=f1e2925]:
                - generic "РАБОТА-1794230045496-11035e25" [ref=f1e2926]
                - generic [ref=f1e2927]:
                  - generic [ref=f1e2928]: 0/10 чел.
                  - generic [ref=f1e2929]: 0%
              - generic [ref=f1e2930]:
                - generic [ref=f1e2945]: "0"
                - generic [ref=f1e2948]: "0"
                - generic [ref=f1e2950]: "0"
                - generic [ref=f1e2952]: "0"
              - generic [ref=f1e2955]:
                - generic [ref=f1e2956]: 0 / 10
                - generic [ref=f1e2957]: 0%
            - generic [ref=f1e2958] [cursor=pointer]:
              - generic [ref=f1e2960]:
                - generic "РАБОТА-1794230112810-b1850b7a" [ref=f1e2961]
                - generic [ref=f1e2962]:
                  - generic [ref=f1e2963]: 0/10 чел.
                  - generic [ref=f1e2964]: 0%
              - generic [ref=f1e2965]:
                - generic [ref=f1e2980]: "0"
                - generic [ref=f1e2983]: "0"
                - generic [ref=f1e2985]: "0"
                - generic [ref=f1e2987]: "0"
              - generic [ref=f1e2990]:
                - generic [ref=f1e2991]: 0 / 10
                - generic [ref=f1e2992]: 0%
            - generic [ref=f1e2993] [cursor=pointer]:
              - generic [ref=f1e2995]:
                - generic "РАБОТА-1794230169686-56a99ba6" [ref=f1e2996]
                - generic [ref=f1e2997]:
                  - generic [ref=f1e2998]: 0/10 чел.
                  - generic [ref=f1e2999]: 0%
              - generic [ref=f1e3000]:
                - generic [ref=f1e3015]: "0"
                - generic [ref=f1e3018]: "0"
                - generic [ref=f1e3020]: "0"
                - generic [ref=f1e3022]: "0"
              - generic [ref=f1e3025]:
                - generic [ref=f1e3026]: 0 / 10
                - generic [ref=f1e3027]: 0%
            - generic [ref=f1e3028] [cursor=pointer]:
              - generic [ref=f1e3030]:
                - generic "РАБОТА-1794230289407-31516c17" [ref=f1e3031]
                - generic [ref=f1e3032]:
                  - generic [ref=f1e3033]: 0/10 чел.
                  - generic [ref=f1e3034]: 0%
              - generic [ref=f1e3035]:
                - generic [ref=f1e3050]: "0"
                - generic [ref=f1e3053]: "0"
                - generic [ref=f1e3055]: "0"
                - generic [ref=f1e3057]: "0"
              - generic [ref=f1e3060]:
                - generic [ref=f1e3061]: 0 / 10
                - generic [ref=f1e3062]: 0%
            - generic [ref=f1e3063] [cursor=pointer]:
              - generic [ref=f1e3065]:
                - generic "РАБОТА-1794230319755-9de45e62" [ref=f1e3066]
                - generic [ref=f1e3067]:
                  - generic [ref=f1e3068]: 0/10 чел.
                  - generic [ref=f1e3069]: 0%
              - generic [ref=f1e3070]:
                - generic [ref=f1e3085]: "0"
                - generic [ref=f1e3088]: "0"
                - generic [ref=f1e3090]: "0"
                - generic [ref=f1e3092]: "0"
              - generic [ref=f1e3095]:
                - generic [ref=f1e3096]: 0 / 10
                - generic [ref=f1e3097]: 0%
            - generic [ref=f1e3098] [cursor=pointer]:
              - generic [ref=f1e3100]:
                - generic "РАБОТА-1794250184392-8d7af1b0" [ref=f1e3101]
                - generic [ref=f1e3102]:
                  - generic [ref=f1e3103]: 2/10 чел.
                  - generic [ref=f1e3104]: 20%
              - generic [ref=f1e3105]:
                - generic [ref=f1e3120]: "1"
                - generic [ref=f1e3123]: "1"
                - generic [ref=f1e3125]: "1"
                - generic [ref=f1e3127]: "1"
              - generic [ref=f1e3130]:
                - generic [ref=f1e3131]: 2 / 10
                - generic [ref=f1e3132]: 20%
            - generic [ref=f1e3133] [cursor=pointer]:
              - generic [ref=f1e3135]:
                - generic "РАБОТА-1794250729732-3edc8eec" [ref=f1e3136]
                - generic [ref=f1e3137]:
                  - generic [ref=f1e3138]: 0/10 чел.
                  - generic [ref=f1e3139]: 0%
              - generic [ref=f1e3140]:
                - generic [ref=f1e3155]: "0"
                - generic [ref=f1e3158]: "0"
                - generic [ref=f1e3160]: "0"
                - generic [ref=f1e3162]: "0"
              - generic [ref=f1e3165]:
                - generic [ref=f1e3166]: 0 / 10
                - generic [ref=f1e3167]: 0%
            - generic [ref=f1e3168] [cursor=pointer]:
              - generic [ref=f1e3170]:
                - generic "РАБОТА-1794251363045-8f55dcee" [ref=f1e3171]
                - generic [ref=f1e3172]:
                  - generic [ref=f1e3173]: 2/10 чел.
                  - generic [ref=f1e3174]: 20%
              - generic [ref=f1e3175]:
                - generic [ref=f1e3190]: "1"
                - generic [ref=f1e3193]: "1"
                - generic [ref=f1e3195]: "1"
                - generic [ref=f1e3197]: "1"
              - generic [ref=f1e3200]:
                - generic [ref=f1e3201]: 2 / 10
                - generic [ref=f1e3202]: 20%
            - generic [ref=f1e3203] [cursor=pointer]:
              - generic [ref=f1e3205]:
                - generic "РАБОТА-1794251363181-b397ed64" [ref=f1e3206]
                - generic [ref=f1e3207]:
                  - generic [ref=f1e3208]: 1/10 чел.
                  - generic [ref=f1e3209]: 10%
              - generic [ref=f1e3210]:
                - generic [ref=f1e3225]: "0"
                - generic [ref=f1e3228]: "0"
                - generic [ref=f1e3230]: "0"
                - generic [ref=f1e3232]: "0"
              - generic [ref=f1e3235]:
                - generic [ref=f1e3236]: 1 / 10
                - generic [ref=f1e3237]: 10%
            - generic [ref=f1e3238] [cursor=pointer]:
              - generic [ref=f1e3240]:
                - generic "РАБОТА-1794251363623-025683cc" [ref=f1e3241]
                - generic [ref=f1e3242]:
                  - generic [ref=f1e3243]: 0/10 чел.
                  - generic [ref=f1e3244]: 0%
              - generic [ref=f1e3245]:
                - generic [ref=f1e3260]: "0"
                - generic [ref=f1e3263]: "0"
                - generic [ref=f1e3265]: "0"
                - generic [ref=f1e3267]: "0"
              - generic [ref=f1e3270]:
                - generic [ref=f1e3271]: 0 / 10
                - generic [ref=f1e3272]: 0%
            - generic [ref=f1e3273] [cursor=pointer]:
              - generic [ref=f1e3275]:
                - generic "РАБОТА-1794251364591-cb8f6dc2" [ref=f1e3276]
                - generic [ref=f1e3277]:
                  - generic [ref=f1e3278]: 2/10 чел.
                  - generic [ref=f1e3279]: 20%
              - generic [ref=f1e3280]:
                - generic [ref=f1e3295]: "1"
                - generic [ref=f1e3298]: "1"
                - generic [ref=f1e3300]: "1"
                - generic [ref=f1e3302]: "1"
              - generic [ref=f1e3305]:
                - generic [ref=f1e3306]: 2 / 10
                - generic [ref=f1e3307]: 20%
            - generic [ref=f1e3308] [cursor=pointer]:
              - generic [ref=f1e3310]:
                - generic "Руководитель работ (на объекте) - 30 чел/смен Супервайзер (на объекте) - 60 чел/смен" [ref=f1e3311]
                - generic [ref=f1e3312]:
                  - generic [ref=f1e3313]: 3/1 чел.
                  - generic [ref=f1e3314]: 300%
              - generic [ref=f1e3315]:
                - generic [ref=f1e3326]: "2"
                - generic [ref=f1e3328]: "2"
              - generic [ref=f1e3338]:
                - generic [ref=f1e3339]: 3 / 1
                - generic [ref=f1e3340]: 300%
            - generic [ref=f1e3341] [cursor=pointer]:
              - generic [ref=f1e3343]:
                - generic "Руководитель работ (на объекте) - 40 ч/ч" [ref=f1e3344]
                - generic [ref=f1e3345]:
                  - generic [ref=f1e3346]: 0/1 чел.
                  - generic [ref=f1e3347]: 0%
              - generic [ref=f1e3348]: "0"
              - generic [ref=f1e3370]:
                - generic [ref=f1e3371]: 0 / 1
                - generic [ref=f1e3372]: 0%
            - generic [ref=f1e3373] [cursor=pointer]:
              - generic [ref=f1e3375]:
                - generic "Супервайзер по фланцевым соединениям, 1 чел. 10 смен" [ref=f1e3376]
                - generic [ref=f1e3377]:
                  - generic [ref=f1e3378]: 2/2 чел.
                  - generic [ref=f1e3379]: 100%
              - generic [ref=f1e3380]:
                - generic [ref=f1e3393]: "1"
                - generic [ref=f1e3395]: "1"
              - generic [ref=f1e3403]:
                - generic [ref=f1e3404]: 2 / 2
                - generic [ref=f1e3405]: 100%
            - generic [ref=f1e3406] [cursor=pointer]:
              - generic [ref=f1e3408]:
                - generic "Супервайзер СС - 1380 ч/ч (138 чел\\дн) (исключен)" [ref=f1e3409]
                - generic [ref=f1e3410]:
                  - generic [ref=f1e3411]: 0/2 чел.
                  - generic [ref=f1e3412]: 0%
              - generic [ref=f1e3413]:
                - generic [ref=f1e3422]: "0"
                - generic [ref=f1e3424]: "0"
                - generic [ref=f1e3426]: "0"
                - generic [ref=f1e3428]: "0"
              - generic [ref=f1e3438]:
                - generic [ref=f1e3439]: 0 / 2
                - generic [ref=f1e3440]: 0%
            - generic [ref=f1e3441] [cursor=pointer]:
              - generic [ref=f1e3443]:
                - generic "Супервайзеры по сварке - 486 ч\\ч" [ref=f1e3444]
                - generic [ref=f1e3445]:
                  - generic [ref=f1e3446]: 0/2 чел.
                  - generic [ref=f1e3447]: 0%
              - generic [ref=f1e3448]:
                - generic [ref=f1e3458]: "0"
                - generic [ref=f1e3460]: "0"
                - generic [ref=f1e3462]: "0"
              - generic [ref=f1e3472]:
                - generic [ref=f1e3473]: 0 / 2
                - generic [ref=f1e3474]: 0%
            - generic [ref=f1e3475] [cursor=pointer]:
              - generic [ref=f1e3477]:
                - generic "Супервайзеры по фланцевым соединения- 2300 ч\\ч Супервайзеры по сварке -2800 ч\\ч (объем был скорректирован)" [ref=f1e3478]
                - generic [ref=f1e3479]:
                  - generic [ref=f1e3480]: 5/2 чел.
                  - generic [ref=f1e3481]: 250%
              - generic [ref=f1e3482]:
                - generic [ref=f1e3493]: "3"
                - generic [ref=f1e3495]: "3"
              - generic [ref=f1e3505]:
                - generic [ref=f1e3506]: 5 / 2
                - generic [ref=f1e3507]: 250%
            - generic [ref=f1e3508] [cursor=pointer]:
              - generic [ref=f1e3510]:
                - generic "Супервайзеры по фланцевым соединения- 2500 ч\\ч Супервайзеры по сварке -1200 ч\\ч (объем был скорректирован)" [ref=f1e3511]
                - generic [ref=f1e3512]:
                  - generic [ref=f1e3513]: 6/2 чел.
                  - generic [ref=f1e3514]: 300%
              - generic [ref=f1e3515]:
                - generic [ref=f1e3525]: "3"
                - generic [ref=f1e3527]: "3"
              - generic [ref=f1e3538]:
                - generic [ref=f1e3539]: 6 / 2
                - generic [ref=f1e3540]: 300%
            - generic [ref=f1e3541] [cursor=pointer]:
              - generic [ref=f1e3543]:
                - generic "Супервайзеры по фланцевым соединения- 366 ч\\ч Супервайзеры по сварке -874 ч\\ч" [ref=f1e3544]
                - generic [ref=f1e3545]:
                  - generic [ref=f1e3546]: 0/2 чел.
                  - generic [ref=f1e3547]: 0%
              - generic [ref=f1e3548]:
                - generic [ref=f1e3559]: "0"
                - generic [ref=f1e3561]: "0"
                - generic [ref=f1e3563]: "0"
              - generic [ref=f1e3572]:
                - generic [ref=f1e3573]: 0 / 2
                - generic [ref=f1e3574]: 0%
            - generic [ref=f1e3575] [cursor=pointer]:
              - generic [ref=f1e3577]:
                - generic "Супервайзеры по фланцевым соединения- 589 ч\\ч Супервайзеры по сварке -500 ч\\ч (объем скорректирован)" [ref=f1e3578]
                - generic [ref=f1e3579]:
                  - generic [ref=f1e3580]: 0/2 чел.
                  - generic [ref=f1e3581]: 0%
              - generic [ref=f1e3582]:
                - generic [ref=f1e3592]: "0"
                - generic [ref=f1e3594]: "0"
                - generic [ref=f1e3596]: "0"
              - generic [ref=f1e3606]:
                - generic [ref=f1e3607]: 0 / 2
                - generic [ref=f1e3608]: 0%
            - generic [ref=f1e3609] [cursor=pointer]:
              - generic [ref=f1e3611]:
                - generic "Супервайзеры по фланцевым соединения- 980 ч\\ч Супервайзеры по сварке -1000 ч\\ч" [ref=f1e3612]
                - generic [ref=f1e3613]:
                  - generic [ref=f1e3614]: 9/2 чел.
                  - generic [ref=f1e3615]: 450%
              - generic [ref=f1e3616]:
                - generic [ref=f1e3626]: "5"
                - generic [ref=f1e3628]: "5"
              - generic [ref=f1e3639]:
                - generic [ref=f1e3640]: 9 / 2
                - generic [ref=f1e3641]: 450%
            - generic [ref=f1e3642] [cursor=pointer]:
              - generic [ref=f1e3644]:
                - generic "Супервайзинг" [ref=f1e3645]
                - generic [ref=f1e3646]:
                  - generic [ref=f1e3647]: 3/3 чел.
                  - generic [ref=f1e3648]: 100%
              - generic [ref=f1e3649]:
                - generic [ref=f1e3659]: "2"
                - generic [ref=f1e3661]: "2"
              - generic [ref=f1e3672]:
                - generic [ref=f1e3673]: 3 / 3
                - generic [ref=f1e3674]: 100%
            - generic [ref=f1e3675] [cursor=pointer]:
              - generic [ref=f1e3677]:
                - generic "Супервайзинг фланцевых соединений Руководитель работ ( на объекте ) - 1 чел.смен" [ref=f1e3678]
                - generic [ref=f1e3679]:
                  - generic [ref=f1e3680]: 1/2 чел.
                  - generic [ref=f1e3681]: 50%
              - generic [ref=f1e3682]: "1"
              - generic [ref=f1e3704]:
                - generic [ref=f1e3705]: 1 / 2
                - generic [ref=f1e3706]: 50%
            - generic [ref=f1e3707] [cursor=pointer]:
              - generic [ref=f1e3709]:
                - 'generic "Супервайзинг фланцевых соединений Л-35/11-600 Производство №5 Объем работ: 77 человеко-часов, ставка 2026 год." [ref=f1e3710]'
                - generic [ref=f1e3711]:
                  - generic [ref=f1e3712]: 0/2 чел.
                  - generic [ref=f1e3713]: 0%
              - generic [ref=f1e3714]: "0"
              - generic [ref=f1e3736]:
                - generic [ref=f1e3737]: 0 / 2
                - generic [ref=f1e3738]: 0%
            - generic [ref=f1e3739] [cursor=pointer]:
              - generic [ref=f1e3741]:
                - generic "Технический контроль 1/2\" (М20) - 47 шт.; 3/4\" (М27) - 16 шт.; 1\" (М33) - 511 шт." [ref=f1e3742]
                - generic [ref=f1e3743]:
                  - generic [ref=f1e3744]: 0/2 чел.
                  - generic [ref=f1e3745]: 0%
              - generic [ref=f1e3746]: "0"
              - generic [ref=f1e3768]:
                - generic [ref=f1e3769]: 0 / 2
                - generic [ref=f1e3770]: 0%
            - generic [ref=f1e3771] [cursor=pointer]:
              - generic [ref=f1e3773]:
                - generic "Установка Висбрекинг цеха №41 Секция 3000 - 179 фл.соед. Руководитель работ - 22 чел/смены" [ref=f1e3774]
                - generic [ref=f1e3775]:
                  - generic [ref=f1e3776]: 2/1 чел.
                  - generic [ref=f1e3777]: 200%
              - generic [ref=f1e3778]:
                - generic [ref=f1e3787]: "1"
                - generic [ref=f1e3789]: "1"
              - generic [ref=f1e3801]:
                - generic [ref=f1e3802]: 2 / 1
                - generic [ref=f1e3803]: 200%
          - generic [ref=f1e3804]:
            - generic [ref=f1e3805]:
              - generic [ref=f1e3806]: "65"
              - generic [ref=f1e3807]: Работ
            - generic [ref=f1e3808]:
              - generic [ref=f1e3809]: "21"
              - generic [ref=f1e3810]: Укомплектовано
            - generic [ref=f1e3811]:
              - generic [ref=f1e3812]: "1"
              - generic [ref=f1e3813]: Частично
            - generic [ref=f1e3814]:
              - generic [ref=f1e3815]: "43"
              - generic [ref=f1e3816]: Недобор
            - generic [ref=f1e3817]: "Период: сент. 25 - фев. 27"
    - navigation [ref=f1e3819]:
      - link "" [ref=f1e3820] [cursor=pointer]:
        - /url: /services/supervision/resource-planning/p_01m70ve6e7fsstyatmk4myg3bc
      - button [ref=f1e3822] [cursor=pointer]:
        - img "Мое фото" [ref=f1e3823]
      - button [ref=f1e3824] [cursor=pointer]:
        - img "Мое фото" [ref=f1e3825]
```

# Test source

```ts
  19  |       timeout: config.timeouts.long,
  20  |     });
  21  |     await locators.availableSection.waitFor({
  22  |       state: 'visible',
  23  |       timeout: config.timeouts.long,
  24  |     });
  25  |   };
  26  | 
  27  |   const openVisitsManagement = async (): Promise<void> => {
  28  |     await basePage.waitForElement(locators.manageVisitsButton);
  29  |     await locators.manageVisitsButton.click();
  30  |   };
  31  | 
  32  |   const saveVisits = async (): Promise<void> => {
  33  |     await basePage.waitForElement(locators.saveButton);
  34  |     await locators.saveButton.click();
  35  |   };
  36  | 
  37  |   /**
  38  |    * Устойчивое добавление кнопки «+».
  39  |    *
  40  |    * После перестройки секции (Grid: row-span-2 соседней карточки) соседний
  41  |    * блок наезжает на кнопку и обычный мышиный клик блокируется hit-test.
  42  |    * Событие `click` на самой кнопке вызывает тот же обработчик.
  43  |    */
  44  |   const clickAddButton = async (button: Locator): Promise<void> => {
  45  |     try {
  46  |       await button.click({ timeout: config.timeouts.short });
  47  |     } catch {
  48  |       await button.dispatchEvent('click');
  49  |     }
  50  |   };
  51  | 
  52  |   const addAvailableWorkersInternal = async (count: number): Promise<string[]> => {
  53  |     await locators.availableAddButton(0).waitFor({
  54  |       state: 'visible',
  55  |       timeout: config.timeouts.long,
  56  |     });
  57  |     const total = await locators.availableAddButtons.count();
  58  |     if (total < count) {
  59  |       throw new Error(
  60  |         `Доступно только ${total} доступных работников, а запрошено добавить ${count}`
  61  |       );
  62  |     }
  63  | 
  64  |     const added: string[] = [];
  65  |     for (let i = 0; i < count; i++) {
  66  |       const name = (await locators.availablePersonName(i).textContent())?.trim() || '';
  67  |       await clickAddButton(locators.availableAddButton(i));
  68  |       added.push(name);
  69  |       await page.waitForLoadState('networkidle').catch(() => {});
  70  |     }
  71  |     return added;
  72  |   };
  73  | 
  74  |   /**
  75  |    * Ищет сотрудника по имени в «Доступном персонале». Имена читаются одним
  76  |    * запросом к DOM (список до 125 человек), иначе поиск по одному имени
  77  |    * упирается в таймаут теста.
  78  |    */
  79  |   const findAvailableIndex = async (name: string): Promise<number> => {
  80  |     const scan = async (): Promise<number> => {
  81  |       const names = await locators.availableSection.last().evaluate((section) =>
  82  |         Array.from(section.querySelectorAll('button[title="Добавить"]')).map((button) => {
  83  |           const span = button.parentElement?.querySelector('span');
  84  |           return (span?.textContent ?? '').trim();
  85  |         })
  86  |       );
  87  |       return names.indexOf(name);
  88  |     };
  89  | 
  90  |     let index = await scan();
  91  |     if (index >= 0) return index;
  92  | 
  93  |     for (let attempt = 0; attempt < 20 && index < 0; attempt++) {
  94  |       await locators.availableSection
  95  |         .last()
  96  |         .hover()
  97  |         .catch(() => {});
  98  |       await page.mouse.wheel(0, 800);
  99  |       index = await scan();
  100 |     }
  101 |     return index;
  102 |   };
  103 | 
  104 |   const addAvailableWorkersByNamesInternal = async (names: string[]): Promise<string[]> => {
  105 |     await locators.availableAddButton(0).waitFor({
  106 |       state: 'visible',
  107 |       timeout: config.timeouts.long,
  108 |     });
  109 | 
  110 |     // Дожидаемся, пока все сотрудники загрузятся в Доступном персонале
  111 |     await expect
  112 |       .poll(async () => locators.availableAddButtons.count(), { timeout: config.timeouts.long })
  113 |       .toBeGreaterThanOrEqual(names.length);
  114 | 
  115 |     const added: string[] = [];
  116 |     for (const name of names) {
  117 |       const index = await findAvailableIndex(name);
  118 |       if (index < 0) {
> 119 |         throw new Error(`Сотрудник «${name}» не найден в Доступном персонале`);
      |               ^ Error: Сотрудник «Визитов Сотрудник1 Тестович» не найден в Доступном персонале
  120 |       }
  121 |       await clickAddButton(locators.availableAddButton(index));
  122 |       added.push(name);
  123 |       await page.waitForLoadState('networkidle').catch(() => {});
  124 |     }
  125 |     return added;
  126 |   };
  127 | 
  128 |   const waitForCondition = async (
  129 |     predicate: () => Promise<boolean>,
  130 |     timeout: number
  131 |   ): Promise<boolean> => {
  132 |     try {
  133 |       await expect.poll(async () => await predicate(), { timeout }).toBe(true);
  134 |       return true;
  135 |     } catch {
  136 |       return false;
  137 |     }
  138 |   };
  139 | 
  140 |   return {
  141 |     ...basePage,
  142 |     locators,
  143 | 
  144 |     open: async (): Promise<void> => {
  145 |       await basePage.openRelative(PAGE_PATH);
  146 |       await basePage.expectVisible(locators.searchInput);
  147 |     },
  148 | 
  149 |     searchWork: async (name: string): Promise<void> => {
  150 |       await locators.searchInput.fill(name);
  151 |       await page.waitForLoadState('networkidle').catch(() => {});
  152 |     },
  153 | 
  154 |     assertWorkVisible: async (name: string): Promise<void> => {
  155 |       await basePage.waitForElement(locators.workCard(name), config.timeouts.long);
  156 |     },
  157 | 
  158 |     openWork: async (name: string): Promise<void> => {
  159 |       await basePage.waitForElement(locators.workCard(name), config.timeouts.long);
  160 |       await locators.workCard(name).click();
  161 |       await page.waitForURL((url) => url.pathname.includes(`${PAGE_PATH}/`), {
  162 |         timeout: config.timeouts.long,
  163 |       });
  164 |       await locators.availableAddButton(0).waitFor({
  165 |         state: 'visible',
  166 |         timeout: config.timeouts.long,
  167 |       });
  168 |     },
  169 | 
  170 |     openWorkByPk: openWorkByPkInternal,
  171 | 
  172 |     addAvailableWorkers: addAvailableWorkersInternal,
  173 | 
  174 |     addAvailableWorkersByNames: addAvailableWorkersByNamesInternal,
  175 | 
  176 |     getClaimedPersonnelCount: async (): Promise<string> => {
  177 |       return (await locators.claimedCount.textContent())?.trim() || '';
  178 |     },
  179 | 
  180 |     assertClaimedContains: async (names: string[]): Promise<void> => {
  181 |       for (const name of names) {
  182 |         await locators
  183 |           .claimedPerson(name)
  184 |           .waitFor({ state: 'visible', timeout: config.timeouts.normal });
  185 |       }
  186 |     },
  187 | 
  188 |     openVisitsManagement,
  189 | 
  190 |     saveVisits,
  191 | 
  192 |     /**
  193 |      * Сохраняет визиты так, чтобы изменение гарантированно зафиксировалось на сервере:
  194 |      * открывает «Управление визитами», сохраняет и проверяет наличие заявленного
  195 |      * персонала и визитов через API, повторяя попытку при сбое.
  196 |      *
  197 |      * Важно: добавление доступных работников меняет только состояние UI, на сервере
  198 |      * персонал появляется лишь после сохранения, поэтому дожидаться его до `saveVisits`
  199 |      * нельзя.
  200 |      */
  201 |     saveVisitsPersisted: async (
  202 |       request: APIRequestContext,
  203 |       workPk: string,
  204 |       count: number
  205 |     ): Promise<void> => {
  206 |       const composition = (): Promise<WorkCompositionInfo> =>
  207 |         getWorkCompositionInfo(request, workPk);
  208 | 
  209 |       const savedOnServer = async (): Promise<boolean> => {
  210 |         const info = await composition();
  211 |         return info.personCount >= count && info.visitCount >= count;
  212 |       };
  213 | 
  214 |       let attempts = 0;
  215 |       while (true) {
  216 |         attempts++;
  217 |         await openVisitsManagement();
  218 |         await saveVisits();
  219 | 
```