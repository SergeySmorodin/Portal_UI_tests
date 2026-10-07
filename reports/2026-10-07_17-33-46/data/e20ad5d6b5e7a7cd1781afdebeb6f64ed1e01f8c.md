# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: services_page\supervision\report-card.spec.ts >> Табель работ >> Открыть табель работы со статусом «Выполнение работы» и проверить персонал
- Location: src\tests\services_page\supervision\report-card.spec.ts:6:3

# Error details

```
TimeoutError: locator.fill: Timeout 15000ms exceeded.
Call log:
  - waiting for locator('table tbody tr').filter({ hasText: 'Бекшенов Жандос _' }).locator('td').nth(6).locator('input').first()

```

# Page snapshot

```yaml
- generic [ref=f2e3]:
  - banner [ref=f2e4]:
    - navigation [ref=f2e5]:
      - list [ref=f2e6]:
        - listitem [ref=f2e7]:
          - generic [ref=f2e8]:
            - generic [ref=f2e9] [cursor=pointer]
            - list [ref=f2e13]:
              - listitem [ref=f2e14]:
                - link " Главная" [ref=f2e15] [cursor=pointer]:
                  - /url: /
                  - generic [ref=f2e16]: 
                  - text: Главная
              - listitem [ref=f2e17]:
                - link " СКиП" [ref=f2e18] [cursor=pointer]:
                  - /url: /SKIP
                  - generic [ref=f2e19]: 
                  - text: СКиП
              - listitem [ref=f2e20]:
                - link " ТДО" [ref=f2e21] [cursor=pointer]:
                  - /url: /tdo/contracts
                  - generic [ref=f2e22]: 
                  - text: ТДО
              - listitem [ref=f2e23]:
                - link " Сопровождение проектов" [ref=f2e24] [cursor=pointer]:
                  - /url: /help/companys
                  - generic [ref=f2e25]: 
                  - text: Сопровождение проектов
              - listitem [ref=f2e26]:
                - link " Сервисы" [ref=f2e27] [cursor=pointer]:
                  - /url: /services
                  - generic [ref=f2e28]: 
                  - text: Сервисы
              - listitem [ref=f2e29]:
                - link " Технический директор" [ref=f2e30] [cursor=pointer]:
                  - /url: /TechnicalDirector
                  - generic [ref=f2e31]: 
                  - text: Технический директор
              - listitem [ref=f2e32]:
                - link " Охрана труда" [ref=f2e33] [cursor=pointer]:
                  - /url: /protection
                  - generic [ref=f2e34]: 
                  - text: Охрана труда
        - listitem [ref=f2e35]:
          - link [ref=f2e36] [cursor=pointer]:
            - /url: /
            - img "logo" [ref=f2e37]
        - listitem
        - listitem [ref=f2e38]:
          - link [ref=f2e39] [cursor=pointer]:
            - /url: /lk
            - heading "Смородин С.А." [level=3] [ref=f2e40]
        - listitem [ref=f2e41]:
          - link "" [ref=f2e42] [cursor=pointer]:
            - /url: /login
  - generic [ref=f2e44]:
    - navigation [ref=f2e45]:
      - link "" [ref=f2e46] [cursor=pointer]:
        - /url: /feedback
      - link "" [ref=f2e48] [cursor=pointer]:
        - /url: /feedback/admin
    - main [ref=f2e50]:
      - heading "Табель работы РАБОТА-1791383530636-66676485" [level=1] [ref=f2e51]
      - generic [ref=f2e53]:
        - button "" [ref=f2e55] [cursor=pointer]
        - generic [ref=f2e57]:
          - button "Закрыть" [ref=f2e58] [cursor=pointer]
          - button " Создать табель" [ref=f2e59] [cursor=pointer]:
            - generic [ref=f2e60]: 
            - text: Создать табель
          - button " Вывести в Excel" [ref=f2e61] [cursor=pointer]:
            - generic [ref=f2e62]: 
            - text: Вывести в Excel
          - button " Расшифровка ставок" [ref=f2e63] [cursor=pointer]:
            - generic [ref=f2e64]: 
            - text: Расшифровка ставок
          - button " Согласование" [ref=f2e65] [cursor=pointer]:
            - generic [ref=f2e66]: 
            - text: Согласование
          - button " Комментарии" [ref=f2e67] [cursor=pointer]:
            - generic [ref=f2e68]: 
            - text: Комментарии
          - button " Сохранить" [ref=f2e69] [cursor=pointer]:
            - generic [ref=f2e70]: 
            - text: Сохранить
        - generic [ref=f2e71]:
          - button "Ставка" [ref=f2e72] [cursor=pointer]
          - button "" [ref=f2e73] [cursor=pointer]
      - generic [ref=f2e75]:
        - generic [ref=f2e76]:
          - generic [ref=f2e80]:
            - generic [ref=f2e81]:
              - heading "Параметры поиска" [level=3] [ref=f2e82]
              - generic [ref=f2e83]:
                - button "" [ref=f2e84] [cursor=pointer]
                - button "" [ref=f2e86] [cursor=pointer]
            - generic [ref=f2e91]:
              - generic [ref=f2e92]:
                - generic [ref=f2e93]: Поиск сотрудника
                - textbox "ФИО" [ref=f2e94]
              - generic [ref=f2e95]:
                - generic [ref=f2e96]: Период (с/по)
                - generic [ref=f2e97]:
                  - textbox "дд-мм-гггг" [ref=f2e101]: 08-10-2026
                  - textbox "дд-мм-гггг" [ref=f2e105]: 07-01-2027
          - generic [ref=f2e107]:
            - heading "Состояние табелей" [level=3] [ref=f2e108]
            - generic [ref=f2e109]: "Периодов: 0"
        - table [ref=f2e113]:
          - rowgroup [ref=f2e114]:
            - row [ref=f2e115]:
              - columnheader [ref=f2e116]:
                - checkbox [ref=f2e117]
              - columnheader "Вид" [ref=f2e118]
              - columnheader "ФИО" [ref=f2e119]
              - columnheader "Должность" [ref=f2e120]
              - columnheader "Роль" [ref=f2e121]
              - columnheader [ref=f2e122]:
                - generic "Ставка" [ref=f2e123]:
                  - text: Ставка
                  - button "" [ref=f2e124] [cursor=pointer]
              - columnheader "октябрь 2026" [ref=f2e126]
              - columnheader "ноябрь 2026" [ref=f2e127]
              - columnheader "декабрь 2026" [ref=f2e128]
              - columnheader "январь 2027" [ref=f2e129]
              - columnheader "Итого" [ref=f2e130]
            - row [ref=f2e131]:
              - columnheader "08" [ref=f2e132]
              - columnheader "09" [ref=f2e133]
              - columnheader "10" [ref=f2e134]
              - columnheader "11" [ref=f2e135]
              - columnheader "12" [ref=f2e136]
              - columnheader "13" [ref=f2e137]
              - columnheader "14" [ref=f2e138]
              - columnheader "15" [ref=f2e139]
              - columnheader "16" [ref=f2e140]
              - columnheader "17" [ref=f2e141]
              - columnheader "18" [ref=f2e142]
              - columnheader "19" [ref=f2e143]
              - columnheader "20" [ref=f2e144]
              - columnheader "21" [ref=f2e145]
              - columnheader "22" [ref=f2e146]
              - columnheader "23" [ref=f2e147]
              - columnheader "24" [ref=f2e148]
              - columnheader "25" [ref=f2e149]
              - columnheader "26" [ref=f2e150]
              - columnheader "27" [ref=f2e151]
              - columnheader "28" [ref=f2e152]
              - columnheader "29" [ref=f2e153]
              - columnheader "30" [ref=f2e154]
              - columnheader "31" [ref=f2e155]
              - columnheader "01" [ref=f2e156]
              - columnheader "02" [ref=f2e157]
              - columnheader "03" [ref=f2e158]
              - columnheader "04" [ref=f2e159]
              - columnheader "05" [ref=f2e160]
              - columnheader "06" [ref=f2e161]
              - columnheader "07" [ref=f2e162]
              - columnheader "08" [ref=f2e163]
              - columnheader "09" [ref=f2e164]
              - columnheader "10" [ref=f2e165]
              - columnheader "11" [ref=f2e166]
              - columnheader "12" [ref=f2e167]
              - columnheader "13" [ref=f2e168]
              - columnheader "14" [ref=f2e169]
              - columnheader "15" [ref=f2e170]
              - columnheader "16" [ref=f2e171]
              - columnheader "17" [ref=f2e172]
              - columnheader "18" [ref=f2e173]
              - columnheader "19" [ref=f2e174]
              - columnheader "20" [ref=f2e175]
              - columnheader "21" [ref=f2e176]
              - columnheader "22" [ref=f2e177]
              - columnheader "23" [ref=f2e178]
              - columnheader "24" [ref=f2e179]
              - columnheader "25" [ref=f2e180]
              - columnheader "26" [ref=f2e181]
              - columnheader "27" [ref=f2e182]
              - columnheader "28" [ref=f2e183]
              - columnheader "29" [ref=f2e184]
              - columnheader "30" [ref=f2e185]
              - columnheader "01" [ref=f2e186]
              - columnheader "02" [ref=f2e187]
              - columnheader "03" [ref=f2e188]
              - columnheader "04" [ref=f2e189]
              - columnheader "05" [ref=f2e190]
              - columnheader "06" [ref=f2e191]
              - columnheader "07" [ref=f2e192]
              - columnheader "08" [ref=f2e193]
              - columnheader "09" [ref=f2e194]
              - columnheader "10" [ref=f2e195]
              - columnheader "11" [ref=f2e196]
              - columnheader "12" [ref=f2e197]
              - columnheader "13" [ref=f2e198]
              - columnheader "14" [ref=f2e199]
              - columnheader "15" [ref=f2e200]
              - columnheader "16" [ref=f2e201]
              - columnheader "17" [ref=f2e202]
              - columnheader "18" [ref=f2e203]
              - columnheader "19" [ref=f2e204]
              - columnheader "20" [ref=f2e205]
              - columnheader "21" [ref=f2e206]
              - columnheader "22" [ref=f2e207]
              - columnheader "23" [ref=f2e208]
              - columnheader "24" [ref=f2e209]
              - columnheader "25" [ref=f2e210]
              - columnheader "26" [ref=f2e211]
              - columnheader "27" [ref=f2e212]
              - columnheader "28" [ref=f2e213]
              - columnheader "29" [ref=f2e214]
              - columnheader "30" [ref=f2e215]
              - columnheader "31" [ref=f2e216]
              - columnheader "01" [ref=f2e217]
              - columnheader "02" [ref=f2e218]
              - columnheader "03" [ref=f2e219]
              - columnheader "04" [ref=f2e220]
              - columnheader "05" [ref=f2e221]
              - columnheader "06" [ref=f2e222]
              - columnheader "07" [ref=f2e223]
              - columnheader "часы" [ref=f2e224]
              - columnheader "сумма" [ref=f2e225]
          - rowgroup [ref=f2e226]:
            - row [ref=f2e227]:
              - cell [ref=f2e228]:
                - checkbox [ref=f2e230]
              - cell [ref=f2e231]:
                - button "" [ref=f2e233] [cursor=pointer]
              - cell "Бекшенов Жандос _" [ref=f2e235]
              - cell "Мастер участка" [ref=f2e236]
              - cell "Заместитель руководителя работ" [ref=f2e237]
              - cell [ref=f2e238]:
                - textbox [ref=f2e239]: "500"
              - cell "-" [ref=f2e240]
              - cell "-" [ref=f2e242]
              - cell "-" [ref=f2e244]
              - cell "-" [ref=f2e246]
              - cell "-" [ref=f2e248]
              - cell "-" [ref=f2e250]
              - cell "-" [ref=f2e252]
              - cell "-" [ref=f2e254]
              - cell "-" [ref=f2e256]
              - cell "-" [ref=f2e258]
              - cell "-" [ref=f2e260]
              - cell "-" [ref=f2e262]
              - cell "-" [ref=f2e264]
              - cell "-" [ref=f2e266]
              - cell "-" [ref=f2e268]
              - cell "-" [ref=f2e270]
              - cell "-" [ref=f2e272]
              - cell "-" [ref=f2e274]
              - cell "-" [ref=f2e276]
              - cell "-" [ref=f2e278]
              - cell "-" [ref=f2e280]
              - cell "-" [ref=f2e282]
              - cell "-" [ref=f2e284]
              - cell "-" [ref=f2e286]
              - cell "-" [ref=f2e288]
              - cell "-" [ref=f2e290]
              - cell "-" [ref=f2e292]
              - cell "-" [ref=f2e294]
              - cell "-" [ref=f2e296]
              - cell "-" [ref=f2e298]
              - cell "-" [ref=f2e300]
              - cell "-" [ref=f2e302]
              - cell "-" [ref=f2e304]
              - cell "-" [ref=f2e306]
              - cell "-" [ref=f2e308]
              - cell "-" [ref=f2e310]
              - cell "-" [ref=f2e312]
              - cell "-" [ref=f2e314]
              - cell "-" [ref=f2e316]
              - cell "-" [ref=f2e318]
              - cell "-" [ref=f2e320]
              - cell "-" [ref=f2e322]
              - cell "-" [ref=f2e324]
              - cell "-" [ref=f2e326]
              - cell "-" [ref=f2e328]
              - cell "-" [ref=f2e330]
              - cell "-" [ref=f2e332]
              - cell "-" [ref=f2e334]
              - cell "-" [ref=f2e336]
              - cell "-" [ref=f2e338]
              - cell "-" [ref=f2e340]
              - cell "-" [ref=f2e342]
              - cell "-" [ref=f2e344]
              - cell "-" [ref=f2e346]
              - cell "-" [ref=f2e348]
              - cell "-" [ref=f2e350]
              - cell "-" [ref=f2e352]
              - cell "-" [ref=f2e354]
              - cell "-" [ref=f2e356]
              - cell "-" [ref=f2e358]
              - cell "-" [ref=f2e360]
              - cell "-" [ref=f2e362]
              - cell "-" [ref=f2e364]
              - cell "-" [ref=f2e366]
              - cell "-" [ref=f2e368]
              - cell "-" [ref=f2e370]
              - cell "-" [ref=f2e372]
              - cell "-" [ref=f2e374]
              - cell "-" [ref=f2e376]
              - cell "-" [ref=f2e378]
              - cell "-" [ref=f2e380]
              - cell "-" [ref=f2e382]
              - cell "-" [ref=f2e384]
              - cell "-" [ref=f2e386]
              - cell "-" [ref=f2e388]
              - cell "-" [ref=f2e390]
              - cell "-" [ref=f2e392]
              - cell "-" [ref=f2e394]
              - cell "-" [ref=f2e396]
              - cell "-" [ref=f2e398]
              - cell "-" [ref=f2e400]
              - cell "-" [ref=f2e402]
              - cell "-" [ref=f2e404]
              - cell "-" [ref=f2e406]
              - cell "-" [ref=f2e408]
              - cell "-" [ref=f2e410]
              - cell "-" [ref=f2e412]
              - cell "-" [ref=f2e414]
              - cell "-" [ref=f2e416]
              - cell "-" [ref=f2e418]
              - cell "-" [ref=f2e420]
              - cell "-" [ref=f2e422]
              - cell "0" [ref=f2e424]
              - cell "0" [ref=f2e425]
            - row [ref=f2e426]:
              - cell "-" [ref=f2e427]
              - cell "-" [ref=f2e429]
              - cell "-" [ref=f2e431]
              - cell "-" [ref=f2e433]
              - cell "-" [ref=f2e435]
              - cell "-" [ref=f2e437]
              - cell "-" [ref=f2e439]
              - cell "-" [ref=f2e441]
              - cell "-" [ref=f2e443]
              - cell "-" [ref=f2e445]
              - cell "-" [ref=f2e447]
              - cell "-" [ref=f2e449]
              - cell "-" [ref=f2e451]
              - cell "-" [ref=f2e453]
              - cell "-" [ref=f2e455]
              - cell "-" [ref=f2e457]
              - cell "-" [ref=f2e459]
              - cell "-" [ref=f2e461]
              - cell "-" [ref=f2e463]
              - cell "-" [ref=f2e465]
              - cell "-" [ref=f2e467]
              - cell "-" [ref=f2e469]
              - cell "-" [ref=f2e471]
              - cell "-" [ref=f2e473]
              - cell "-" [ref=f2e475]
              - cell "-" [ref=f2e477]
              - cell "-" [ref=f2e479]
              - cell "-" [ref=f2e481]
              - cell "-" [ref=f2e483]
              - cell "-" [ref=f2e485]
              - cell "-" [ref=f2e487]
              - cell "-" [ref=f2e489]
              - cell "-" [ref=f2e491]
              - cell "-" [ref=f2e493]
              - cell "-" [ref=f2e495]
              - cell "-" [ref=f2e497]
              - cell "-" [ref=f2e499]
              - cell "-" [ref=f2e501]
              - cell "-" [ref=f2e503]
              - cell "-" [ref=f2e505]
              - cell "-" [ref=f2e507]
              - cell "-" [ref=f2e509]
              - cell "-" [ref=f2e511]
              - cell "-" [ref=f2e513]
              - cell "-" [ref=f2e515]
              - cell "-" [ref=f2e517]
              - cell "-" [ref=f2e519]
              - cell "-" [ref=f2e521]
              - cell "-" [ref=f2e523]
              - cell "-" [ref=f2e525]
              - cell "-" [ref=f2e527]
              - cell "-" [ref=f2e529]
              - cell "-" [ref=f2e531]
              - cell "-" [ref=f2e533]
              - cell "-" [ref=f2e535]
              - cell "-" [ref=f2e537]
              - cell "-" [ref=f2e539]
              - cell "-" [ref=f2e541]
              - cell "-" [ref=f2e543]
              - cell "-" [ref=f2e545]
              - cell "-" [ref=f2e547]
              - cell "-" [ref=f2e549]
              - cell "-" [ref=f2e551]
              - cell "-" [ref=f2e553]
              - cell "-" [ref=f2e555]
              - cell "-" [ref=f2e557]
              - cell "-" [ref=f2e559]
              - cell "-" [ref=f2e561]
              - cell "-" [ref=f2e563]
              - cell "-" [ref=f2e565]
              - cell "-" [ref=f2e567]
              - cell "-" [ref=f2e569]
              - cell "-" [ref=f2e571]
              - cell "-" [ref=f2e573]
              - cell "-" [ref=f2e575]
              - cell "-" [ref=f2e577]
              - cell "-" [ref=f2e579]
              - cell "-" [ref=f2e581]
              - cell "-" [ref=f2e583]
              - cell "-" [ref=f2e585]
              - cell "-" [ref=f2e587]
              - cell "-" [ref=f2e589]
              - cell "-" [ref=f2e591]
              - cell "-" [ref=f2e593]
              - cell "-" [ref=f2e595]
              - cell "-" [ref=f2e597]
              - cell "-" [ref=f2e599]
              - cell "-" [ref=f2e601]
              - cell "-" [ref=f2e603]
              - cell "-" [ref=f2e605]
              - cell "-" [ref=f2e607]
              - cell "-" [ref=f2e609]
          - rowgroup [ref=f2e611]:
            - row [ref=f2e612]:
              - cell [ref=f2e613]:
                - checkbox [ref=f2e615]
              - cell [ref=f2e616]:
                - button "" [ref=f2e618] [cursor=pointer]
              - cell "Бикеев Антон Алексеевич" [ref=f2e620]
              - cell "Ведущий инженер по сварке" [ref=f2e621]
              - cell "Заместитель руководителя работ" [ref=f2e622]
              - cell [ref=f2e623]:
                - textbox [active] [ref=f2e624]: "500"
              - cell "-" [ref=f2e625]
              - cell "-" [ref=f2e627]
              - cell "-" [ref=f2e629]
              - cell "-" [ref=f2e631]
              - cell "-" [ref=f2e633]
              - cell "-" [ref=f2e635]
              - cell "-" [ref=f2e637]
              - cell "-" [ref=f2e639]
              - cell "-" [ref=f2e641]
              - cell "-" [ref=f2e643]
              - cell "-" [ref=f2e645]
              - cell "-" [ref=f2e647]
              - cell "-" [ref=f2e649]
              - cell "-" [ref=f2e651]
              - cell "-" [ref=f2e653]
              - cell "-" [ref=f2e655]
              - cell "-" [ref=f2e657]
              - cell "-" [ref=f2e659]
              - cell "-" [ref=f2e661]
              - cell "-" [ref=f2e663]
              - cell "-" [ref=f2e665]
              - cell "-" [ref=f2e667]
              - cell "-" [ref=f2e669]
              - cell "-" [ref=f2e671]
              - cell "-" [ref=f2e673]
              - cell "-" [ref=f2e675]
              - cell "-" [ref=f2e677]
              - cell "-" [ref=f2e679]
              - cell "-" [ref=f2e681]
              - cell "-" [ref=f2e683]
              - cell "-" [ref=f2e685]
              - cell "-" [ref=f2e687]
              - cell "-" [ref=f2e689]
              - cell "-" [ref=f2e691]
              - cell "-" [ref=f2e693]
              - cell "-" [ref=f2e695]
              - cell "-" [ref=f2e697]
              - cell "-" [ref=f2e699]
              - cell "-" [ref=f2e701]
              - cell "-" [ref=f2e703]
              - cell "-" [ref=f2e705]
              - cell "-" [ref=f2e707]
              - cell "-" [ref=f2e709]
              - cell "-" [ref=f2e711]
              - cell "-" [ref=f2e713]
              - cell "-" [ref=f2e715]
              - cell "-" [ref=f2e717]
              - cell "-" [ref=f2e719]
              - cell "-" [ref=f2e721]
              - cell "-" [ref=f2e723]
              - cell "-" [ref=f2e725]
              - cell "-" [ref=f2e727]
              - cell "-" [ref=f2e729]
              - cell "-" [ref=f2e731]
              - cell "-" [ref=f2e733]
              - cell "-" [ref=f2e735]
              - cell "-" [ref=f2e737]
              - cell "-" [ref=f2e739]
              - cell "-" [ref=f2e741]
              - cell "-" [ref=f2e743]
              - cell "-" [ref=f2e745]
              - cell "-" [ref=f2e747]
              - cell "-" [ref=f2e749]
              - cell "-" [ref=f2e751]
              - cell "-" [ref=f2e753]
              - cell "-" [ref=f2e755]
              - cell "-" [ref=f2e757]
              - cell "-" [ref=f2e759]
              - cell "-" [ref=f2e761]
              - cell "-" [ref=f2e763]
              - cell "-" [ref=f2e765]
              - cell "-" [ref=f2e767]
              - cell "-" [ref=f2e769]
              - cell "-" [ref=f2e771]
              - cell "-" [ref=f2e773]
              - cell "-" [ref=f2e775]
              - cell "-" [ref=f2e777]
              - cell "-" [ref=f2e779]
              - cell "-" [ref=f2e781]
              - cell "-" [ref=f2e783]
              - cell "-" [ref=f2e785]
              - cell "-" [ref=f2e787]
              - cell "-" [ref=f2e789]
              - cell "-" [ref=f2e791]
              - cell "-" [ref=f2e793]
              - cell "-" [ref=f2e795]
              - cell "-" [ref=f2e797]
              - cell "-" [ref=f2e799]
              - cell "-" [ref=f2e801]
              - cell "-" [ref=f2e803]
              - cell "-" [ref=f2e805]
              - cell "-" [ref=f2e807]
              - cell "0" [ref=f2e809]
              - cell "0" [ref=f2e810]
            - row [ref=f2e811]:
              - cell "-" [ref=f2e812]
              - cell "-" [ref=f2e814]
              - cell "-" [ref=f2e816]
              - cell "-" [ref=f2e818]
              - cell "-" [ref=f2e820]
              - cell "-" [ref=f2e822]
              - cell "-" [ref=f2e824]
              - cell "-" [ref=f2e826]
              - cell "-" [ref=f2e828]
              - cell "-" [ref=f2e830]
              - cell "-" [ref=f2e832]
              - cell "-" [ref=f2e834]
              - cell "-" [ref=f2e836]
              - cell "-" [ref=f2e838]
              - cell "-" [ref=f2e840]
              - cell "-" [ref=f2e842]
              - cell "-" [ref=f2e844]
              - cell "-" [ref=f2e846]
              - cell "-" [ref=f2e848]
              - cell "-" [ref=f2e850]
              - cell "-" [ref=f2e852]
              - cell "-" [ref=f2e854]
              - cell "-" [ref=f2e856]
              - cell "-" [ref=f2e858]
              - cell "-" [ref=f2e860]
              - cell "-" [ref=f2e862]
              - cell "-" [ref=f2e864]
              - cell "-" [ref=f2e866]
              - cell "-" [ref=f2e868]
              - cell "-" [ref=f2e870]
              - cell "-" [ref=f2e872]
              - cell "-" [ref=f2e874]
              - cell "-" [ref=f2e876]
              - cell "-" [ref=f2e878]
              - cell "-" [ref=f2e880]
              - cell "-" [ref=f2e882]
              - cell "-" [ref=f2e884]
              - cell "-" [ref=f2e886]
              - cell "-" [ref=f2e888]
              - cell "-" [ref=f2e890]
              - cell "-" [ref=f2e892]
              - cell "-" [ref=f2e894]
              - cell "-" [ref=f2e896]
              - cell "-" [ref=f2e898]
              - cell "-" [ref=f2e900]
              - cell "-" [ref=f2e902]
              - cell "-" [ref=f2e904]
              - cell "-" [ref=f2e906]
              - cell "-" [ref=f2e908]
              - cell "-" [ref=f2e910]
              - cell "-" [ref=f2e912]
              - cell "-" [ref=f2e914]
              - cell "-" [ref=f2e916]
              - cell "-" [ref=f2e918]
              - cell "-" [ref=f2e920]
              - cell "-" [ref=f2e922]
              - cell "-" [ref=f2e924]
              - cell "-" [ref=f2e926]
              - cell "-" [ref=f2e928]
              - cell "-" [ref=f2e930]
              - cell "-" [ref=f2e932]
              - cell "-" [ref=f2e934]
              - cell "-" [ref=f2e936]
              - cell "-" [ref=f2e938]
              - cell "-" [ref=f2e940]
              - cell "-" [ref=f2e942]
              - cell "-" [ref=f2e944]
              - cell "-" [ref=f2e946]
              - cell "-" [ref=f2e948]
              - cell "-" [ref=f2e950]
              - cell "-" [ref=f2e952]
              - cell "-" [ref=f2e954]
              - cell "-" [ref=f2e956]
              - cell "-" [ref=f2e958]
              - cell "-" [ref=f2e960]
              - cell "-" [ref=f2e962]
              - cell "-" [ref=f2e964]
              - cell "-" [ref=f2e966]
              - cell "-" [ref=f2e968]
              - cell "-" [ref=f2e970]
              - cell "-" [ref=f2e972]
              - cell "-" [ref=f2e974]
              - cell "-" [ref=f2e976]
              - cell "-" [ref=f2e978]
              - cell "-" [ref=f2e980]
              - cell "-" [ref=f2e982]
              - cell "-" [ref=f2e984]
              - cell "-" [ref=f2e986]
              - cell "-" [ref=f2e988]
              - cell "-" [ref=f2e990]
              - cell "-" [ref=f2e992]
              - cell "-" [ref=f2e994]
    - navigation [ref=f2e996]:
      - link "" [ref=f2e997] [cursor=pointer]:
        - /url: /services/supervision/project/p_01m4bcev72fegvgtnr4ethy2xf/reportcard
      - button [ref=f2e999] [cursor=pointer]:
        - img "Мое фото" [ref=f2e1000]
      - button [ref=f2e1001] [cursor=pointer]:
        - img "Мое фото" [ref=f2e1002]
```

# Test source

```ts
  1   | import { Page } from '@playwright/test';
  2   | import { createBasePage } from '../../base-page';
  3   | import { createReportCardLocators } from '../../../locators/report-card.locators';
  4   | import { config } from '../../../config';
  5   | import { api } from '../../../test-data/api/api-handles';
  6   | 
  7   | export const createReportCardPage = (page: Page) => {
  8   |   const basePage = createBasePage(page);
  9   |   const locators = createReportCardLocators(page);
  10  | 
  11  |   const lastCellValue = async (name: string, offsetFromEnd: number): Promise<string> => {
  12  |     const cells = locators.workerDayCells(name);
  13  |     const count = await cells.count();
  14  |     return (await cells.nth(count - offsetFromEnd).textContent())?.trim() || '';
  15  |   };
  16  | 
  17  |   return {
  18  |     ...basePage,
  19  |     locators,
  20  | 
  21  |     getHeading: async (): Promise<string> => {
  22  |       return (await locators.heading.textContent())?.trim() || '';
  23  |     },
  24  | 
  25  |     waitForLoaded: async (workName: string): Promise<void> => {
  26  |       await locators
  27  |         .headingTab(workName)
  28  |         .waitFor({ state: 'visible', timeout: config.timeouts.long });
  29  |     },
  30  | 
  31  |     getWorkerNames: async (): Promise<string[]> => {
  32  |       const count = await locators.workerRows.count();
  33  |       const names: string[] = [];
  34  |       for (let i = 0; i < count; i++) {
  35  |         const text = (await locators.workerRows.nth(i).textContent())?.trim() || '';
  36  |         names.push(text);
  37  |       }
  38  |       return names;
  39  |     },
  40  | 
  41  |     getWorkerCount: async (): Promise<number> => {
  42  |       return await locators.workerRows.count();
  43  |     },
  44  | 
  45  |     expectWorkerVisible: async (name: string): Promise<void> => {
  46  |       await locators
  47  |         .workerRow(name)
  48  |         .first()
  49  |         .waitFor({ state: 'visible', timeout: config.timeouts.normal });
  50  |     },
  51  | 
  52  |     createPeriods: async (): Promise<void> => {
  53  |       await locators.createButton.click();
  54  |       await locators.createConfirmButton.click();
  55  |     },
  56  | 
  57  |     openRateRows: async (): Promise<void> => {
  58  |       await locators.rateRowsButton.click();
  59  |     },
  60  | 
  61  |     getRateInputValue: async (name: string): Promise<string> => {
  62  |       return await locators.workerRateInput(name).inputValue();
  63  |     },
  64  | 
  65  |     fillRate: async (name: string, value: string): Promise<void> => {
  66  |       await locators.workerRateInput(name).fill(value);
  67  |     },
  68  | 
  69  |     fillWorkHours: async (name: string, dayIndexes: number[], value: string): Promise<void> => {
  70  |       for (const dayIndex of dayIndexes) {
> 71  |         await locators.workerDayInput(name, dayIndex).fill(value);
      |                                                       ^ TimeoutError: locator.fill: Timeout 15000ms exceeded.
  72  |       }
  73  |     },
  74  | 
  75  |     getHours: async (name: string): Promise<string> => {
  76  |       return await lastCellValue(name, 2);
  77  |     },
  78  | 
  79  |     getSum: async (name: string): Promise<string> => {
  80  |       return await lastCellValue(name, 1);
  81  |     },
  82  | 
  83  |     // Сохранение шлёт PATCH /api/project_report_card/<pk>/ и затем перезагружает
  84  |     // табель (GET). Дожидаемся завершения обоих запросов, иначе последующий
  85  |     // ререндер страницы «отцепляет» открытую модалку согласования.
  86  |     save: async (): Promise<void> => {
  87  |       const patched = page.waitForResponse(
  88  |         (resp) =>
  89  |           resp.url().includes(api.reportCard) && resp.request().method() === 'PATCH' && resp.ok(),
  90  |         { timeout: config.timeouts.long }
  91  |       );
  92  | 
  93  |       await locators.saveButton.click();
  94  |       await patched;
  95  |       await page.waitForLoadState('networkidle').catch(() => {});
  96  |     },
  97  | 
  98  |     openApproval: async (): Promise<void> => {
  99  |       await locators.approvalButton.click();
  100 |       await locators.approvalModal.waitFor({ state: 'visible', timeout: config.timeouts.long });
  101 |     },
  102 | 
  103 |     submitApproval: async (periodEnd: string): Promise<void> => {
  104 |       await locators.approvalPeriodEndInput.fill(periodEnd);
  105 |       await locators.approvalSubmitButton.click();
  106 |       await locators.approvalModal.waitFor({ state: 'hidden', timeout: config.timeouts.long });
  107 |     },
  108 | 
  109 |     getPeriodsCount: async (): Promise<number> => {
  110 |       const text = (await locators.periodsCount.textContent())?.trim() || '';
  111 |       const match = text.match(/Периодов:\s*(\d+)/);
  112 |       return match ? Number(match[1]) : 0;
  113 |     },
  114 |   };
  115 | };
  116 | 
  117 | export type ReportCardPage = ReturnType<typeof createReportCardPage>;
  118 | 
```