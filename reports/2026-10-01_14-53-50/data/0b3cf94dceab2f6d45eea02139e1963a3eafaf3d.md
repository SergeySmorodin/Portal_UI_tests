# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: services_page\supervision\report-card.spec.ts >> Табель работ >> Открыть табель работы со статусом «Выполнение работы» и проверить персонал
- Location: src\tests\services_page\supervision\report-card.spec.ts:6:3

# Error details

```
TimeoutError: page.waitForResponse: Timeout 9000ms exceeded while waiting for event "response"
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
      - heading "Табель работы РАБОТА-1790855564202-ada25471" [level=1] [ref=f2e51]
      - generic [ref=f2e53]:
        - button "" [ref=f2e55] [cursor=pointer]
        - generic [ref=f2e57]:
          - button "Закрыть" [ref=f2e58] [cursor=pointer]
          - button " Создать табель" [disabled]:
            - generic: 
            - text: Создать табель
          - button " Вывести в Excel" [ref=f2e59] [cursor=pointer]:
            - generic [ref=f2e60]: 
            - text: Вывести в Excel
          - button " Расшифровка ставок" [ref=f2e61] [cursor=pointer]:
            - generic [ref=f2e62]: 
            - text: Расшифровка ставок
          - button " Согласование" [ref=f2e63] [cursor=pointer]:
            - generic [ref=f2e64]: 
            - text: Согласование
          - button " Комментарии" [ref=f2e65] [cursor=pointer]:
            - generic [ref=f2e66]: 
            - text: Комментарии
          - button " Сохранить" [ref=f2e67] [cursor=pointer]:
            - generic [ref=f2e68]: 
            - text: Сохранить
        - generic [ref=f2e69]:
          - button "Ставка" [ref=f2e70] [cursor=pointer]
          - button "" [ref=f2e71] [cursor=pointer]
      - generic [ref=f2e73]:
        - generic [ref=f2e74]:
          - generic [ref=f2e78]:
            - generic [ref=f2e79]:
              - heading "Параметры поиска" [level=3] [ref=f2e80]
              - generic [ref=f2e81]:
                - button "" [ref=f2e82] [cursor=pointer]
                - button "" [ref=f2e84] [cursor=pointer]
            - generic [ref=f2e89]:
              - generic [ref=f2e90]:
                - generic [ref=f2e91]: Поиск сотрудника
                - textbox "ФИО" [ref=f2e92]
              - generic [ref=f2e93]:
                - generic [ref=f2e94]: Период (с/по)
                - generic [ref=f2e95]:
                  - textbox "дд-мм-гггг" [ref=f2e99]: 02-10-2026
                  - textbox "дд-мм-гггг" [ref=f2e103]: 01-01-2027
          - generic [ref=f2e105]:
            - heading "Состояние табелей" [level=3] [ref=f2e106]
            - generic [ref=f2e107]: "Периодов: 0"
        - table [ref=f2e111]:
          - rowgroup [ref=f2e112]:
            - row [ref=f2e113]:
              - columnheader [ref=f2e114]:
                - checkbox [ref=f2e115]
              - columnheader "Вид" [ref=f2e116]
              - columnheader "ФИО" [ref=f2e117]
              - columnheader "Должность" [ref=f2e118]
              - columnheader "Роль" [ref=f2e119]
              - columnheader [ref=f2e120]:
                - generic "Ставка" [ref=f2e121]:
                  - text: Ставка
                  - button "" [ref=f2e122] [cursor=pointer]
              - columnheader "октябрь 2026" [ref=f2e124]
              - columnheader "ноябрь 2026" [ref=f2e125]
              - columnheader "декабрь 2026" [ref=f2e126]
              - columnheader "январь 2027" [ref=f2e127]
              - columnheader "Итого" [ref=f2e128]
            - row [ref=f2e129]:
              - columnheader "02" [ref=f2e130]
              - columnheader "03" [ref=f2e131]
              - columnheader "04" [ref=f2e132]
              - columnheader "05" [ref=f2e133]
              - columnheader "06" [ref=f2e134]
              - columnheader "07" [ref=f2e135]
              - columnheader "08" [ref=f2e136]
              - columnheader "09" [ref=f2e137]
              - columnheader "10" [ref=f2e138]
              - columnheader "11" [ref=f2e139]
              - columnheader "12" [ref=f2e140]
              - columnheader "13" [ref=f2e141]
              - columnheader "14" [ref=f2e142]
              - columnheader "15" [ref=f2e143]
              - columnheader "16" [ref=f2e144]
              - columnheader "17" [ref=f2e145]
              - columnheader "18" [ref=f2e146]
              - columnheader "19" [ref=f2e147]
              - columnheader "20" [ref=f2e148]
              - columnheader "21" [ref=f2e149]
              - columnheader "22" [ref=f2e150]
              - columnheader "23" [ref=f2e151]
              - columnheader "24" [ref=f2e152]
              - columnheader "25" [ref=f2e153]
              - columnheader "26" [ref=f2e154]
              - columnheader "27" [ref=f2e155]
              - columnheader "28" [ref=f2e156]
              - columnheader "29" [ref=f2e157]
              - columnheader "30" [ref=f2e158]
              - columnheader "31" [ref=f2e159]
              - columnheader "01" [ref=f2e160]
              - columnheader "02" [ref=f2e161]
              - columnheader "03" [ref=f2e162]
              - columnheader "04" [ref=f2e163]
              - columnheader "05" [ref=f2e164]
              - columnheader "06" [ref=f2e165]
              - columnheader "07" [ref=f2e166]
              - columnheader "08" [ref=f2e167]
              - columnheader "09" [ref=f2e168]
              - columnheader "10" [ref=f2e169]
              - columnheader "11" [ref=f2e170]
              - columnheader "12" [ref=f2e171]
              - columnheader "13" [ref=f2e172]
              - columnheader "14" [ref=f2e173]
              - columnheader "15" [ref=f2e174]
              - columnheader "16" [ref=f2e175]
              - columnheader "17" [ref=f2e176]
              - columnheader "18" [ref=f2e177]
              - columnheader "19" [ref=f2e178]
              - columnheader "20" [ref=f2e179]
              - columnheader "21" [ref=f2e180]
              - columnheader "22" [ref=f2e181]
              - columnheader "23" [ref=f2e182]
              - columnheader "24" [ref=f2e183]
              - columnheader "25" [ref=f2e184]
              - columnheader "26" [ref=f2e185]
              - columnheader "27" [ref=f2e186]
              - columnheader "28" [ref=f2e187]
              - columnheader "29" [ref=f2e188]
              - columnheader "30" [ref=f2e189]
              - columnheader "01" [ref=f2e190]
              - columnheader "02" [ref=f2e191]
              - columnheader "03" [ref=f2e192]
              - columnheader "04" [ref=f2e193]
              - columnheader "05" [ref=f2e194]
              - columnheader "06" [ref=f2e195]
              - columnheader "07" [ref=f2e196]
              - columnheader "08" [ref=f2e197]
              - columnheader "09" [ref=f2e198]
              - columnheader "10" [ref=f2e199]
              - columnheader "11" [ref=f2e200]
              - columnheader "12" [ref=f2e201]
              - columnheader "13" [ref=f2e202]
              - columnheader "14" [ref=f2e203]
              - columnheader "15" [ref=f2e204]
              - columnheader "16" [ref=f2e205]
              - columnheader "17" [ref=f2e206]
              - columnheader "18" [ref=f2e207]
              - columnheader "19" [ref=f2e208]
              - columnheader "20" [ref=f2e209]
              - columnheader "21" [ref=f2e210]
              - columnheader "22" [ref=f2e211]
              - columnheader "23" [ref=f2e212]
              - columnheader "24" [ref=f2e213]
              - columnheader "25" [ref=f2e214]
              - columnheader "26" [ref=f2e215]
              - columnheader "27" [ref=f2e216]
              - columnheader "28" [ref=f2e217]
              - columnheader "29" [ref=f2e218]
              - columnheader "30" [ref=f2e219]
              - columnheader "31" [ref=f2e220]
              - columnheader "01" [ref=f2e221]
              - columnheader "часы" [ref=f2e222]
              - columnheader "сумма" [ref=f2e223]
          - rowgroup [ref=f2e224]:
            - row [ref=f2e225]:
              - cell [ref=f2e226]:
                - checkbox [ref=f2e228]
              - cell [ref=f2e229]:
                - button "" [ref=f2e231] [cursor=pointer]
              - cell "Брынзей Богдан Васильевич" [ref=f2e233]
              - cell "Инженер-механик 1 категории" [ref=f2e234]
              - cell "Заместитель руководителя работ" [ref=f2e235]
              - cell [ref=f2e236]:
                - textbox [ref=f2e237]: "500"
              - cell [ref=f2e238]:
                - textbox [ref=f2e239]: "8"
              - cell [ref=f2e240]:
                - textbox [ref=f2e241]: "8"
              - cell [ref=f2e242]:
                - textbox [ref=f2e243]: "8"
              - cell [ref=f2e244]:
                - textbox [ref=f2e245]
              - cell [ref=f2e246]:
                - textbox [ref=f2e247]
              - cell [ref=f2e248]:
                - textbox [ref=f2e249]
              - cell [ref=f2e250]:
                - textbox [ref=f2e251]
              - cell [ref=f2e252]:
                - textbox [ref=f2e253]
              - cell [ref=f2e254]:
                - textbox [ref=f2e255]
              - cell [ref=f2e256]:
                - textbox [ref=f2e257]
              - cell [ref=f2e258]:
                - textbox [ref=f2e259]
              - cell [ref=f2e260]:
                - textbox [ref=f2e261]
              - cell [ref=f2e262]:
                - textbox [ref=f2e263]
              - cell [ref=f2e264]:
                - textbox [ref=f2e265]
              - cell [ref=f2e266]:
                - textbox [ref=f2e267]
              - cell [ref=f2e268]:
                - textbox [ref=f2e269]
              - cell [ref=f2e270]:
                - textbox [ref=f2e271]
              - cell [ref=f2e272]:
                - textbox [ref=f2e273]
              - cell [ref=f2e274]:
                - textbox [ref=f2e275]
              - cell [ref=f2e276]:
                - textbox [ref=f2e277]
              - cell [ref=f2e278]:
                - textbox [ref=f2e279]
              - cell [ref=f2e280]:
                - textbox [ref=f2e281]
              - cell [ref=f2e282]:
                - textbox [ref=f2e283]
              - cell [ref=f2e284]:
                - textbox [ref=f2e285]
              - cell [ref=f2e286]:
                - textbox [ref=f2e287]
              - cell [ref=f2e288]:
                - textbox [ref=f2e289]
              - cell [ref=f2e290]:
                - textbox [ref=f2e291]
              - cell [ref=f2e292]:
                - textbox [ref=f2e293]
              - cell [ref=f2e294]:
                - textbox [ref=f2e295]
              - cell [ref=f2e296]:
                - textbox [ref=f2e297]
              - cell [ref=f2e298]:
                - textbox [ref=f2e299]
              - cell [ref=f2e300]:
                - textbox [ref=f2e301]
              - cell [ref=f2e302]:
                - textbox [ref=f2e303]
              - cell [ref=f2e304]:
                - textbox [ref=f2e305]
              - cell [ref=f2e306]:
                - textbox [ref=f2e307]
              - cell [ref=f2e308]:
                - textbox [ref=f2e309]
              - cell [ref=f2e310]:
                - textbox [ref=f2e311]
              - cell [ref=f2e312]:
                - textbox [ref=f2e313]
              - cell [ref=f2e314]:
                - textbox [ref=f2e315]
              - cell [ref=f2e316]:
                - textbox [ref=f2e317]
              - cell [ref=f2e318]:
                - textbox [ref=f2e319]
              - cell [ref=f2e320]:
                - textbox [ref=f2e321]
              - cell [ref=f2e322]:
                - textbox [ref=f2e323]
              - cell [ref=f2e324]:
                - textbox [ref=f2e325]
              - cell [ref=f2e326]:
                - textbox [ref=f2e327]
              - cell [ref=f2e328]:
                - textbox [ref=f2e329]
              - cell [ref=f2e330]:
                - textbox [ref=f2e331]
              - cell [ref=f2e332]:
                - textbox [ref=f2e333]
              - cell [ref=f2e334]:
                - textbox [ref=f2e335]
              - cell [ref=f2e336]:
                - textbox [ref=f2e337]
              - cell [ref=f2e338]:
                - textbox [ref=f2e339]
              - cell [ref=f2e340]:
                - textbox [ref=f2e341]
              - cell [ref=f2e342]:
                - textbox [ref=f2e343]
              - cell [ref=f2e344]:
                - textbox [ref=f2e345]
              - cell [ref=f2e346]:
                - textbox [ref=f2e347]
              - cell [ref=f2e348]:
                - textbox [ref=f2e349]
              - cell [ref=f2e350]:
                - textbox [ref=f2e351]
              - cell [ref=f2e352]:
                - textbox [ref=f2e353]
              - cell [ref=f2e354]:
                - textbox [ref=f2e355]
              - cell [ref=f2e356]:
                - textbox [ref=f2e357]
              - cell [ref=f2e358]:
                - textbox [ref=f2e359]
              - cell [ref=f2e360]:
                - textbox [ref=f2e361]
              - cell [ref=f2e362]:
                - textbox [ref=f2e363]
              - cell [ref=f2e364]:
                - textbox [ref=f2e365]
              - cell [ref=f2e366]:
                - textbox [ref=f2e367]
              - cell [ref=f2e368]:
                - textbox [ref=f2e369]
              - cell [ref=f2e370]:
                - textbox [ref=f2e371]
              - cell [ref=f2e372]:
                - textbox [ref=f2e373]
              - cell [ref=f2e374]:
                - textbox [ref=f2e375]
              - cell [ref=f2e376]:
                - textbox [ref=f2e377]
              - cell [ref=f2e378]:
                - textbox [ref=f2e379]
              - cell [ref=f2e380]:
                - textbox [ref=f2e381]
              - cell [ref=f2e382]:
                - textbox [ref=f2e383]
              - cell [ref=f2e384]:
                - textbox [ref=f2e385]
              - cell [ref=f2e386]:
                - textbox [ref=f2e387]
              - cell [ref=f2e388]:
                - textbox [ref=f2e389]
              - cell [ref=f2e390]:
                - textbox [ref=f2e391]
              - cell [ref=f2e392]:
                - textbox [ref=f2e393]
              - cell [ref=f2e394]:
                - textbox [ref=f2e395]
              - cell [ref=f2e396]:
                - textbox [ref=f2e397]
              - cell [ref=f2e398]:
                - textbox [ref=f2e399]
              - cell [ref=f2e400]:
                - textbox [ref=f2e401]
              - cell [ref=f2e402]:
                - textbox [ref=f2e403]
              - cell [ref=f2e404]:
                - textbox [ref=f2e405]
              - cell [ref=f2e406]:
                - textbox [ref=f2e407]
              - cell [ref=f2e408]:
                - textbox [ref=f2e409]
              - cell [ref=f2e410]:
                - textbox [ref=f2e411]
              - cell [ref=f2e412]:
                - textbox [ref=f2e413]
              - cell [ref=f2e414]:
                - textbox [ref=f2e415]
              - cell [ref=f2e416]:
                - textbox [ref=f2e417]
              - cell [ref=f2e418]:
                - textbox [ref=f2e419]
              - cell [ref=f2e420]:
                - textbox [ref=f2e421]
              - cell "24" [ref=f2e422]
              - cell "0" [ref=f2e423]
            - row [ref=f2e424]:
              - cell [ref=f2e425]:
                - textbox [ref=f2e426]: "500"
              - cell [ref=f2e427]:
                - textbox [ref=f2e428]: "500"
              - cell [ref=f2e429]:
                - textbox [ref=f2e430]: "500"
              - cell [ref=f2e431]:
                - textbox [ref=f2e432]: "500"
              - cell [ref=f2e433]:
                - textbox [ref=f2e434]: "500"
              - cell [ref=f2e435]:
                - textbox [ref=f2e436]: "500"
              - cell [ref=f2e437]:
                - textbox [ref=f2e438]: "500"
              - cell [ref=f2e439]:
                - textbox [ref=f2e440]: "500"
              - cell [ref=f2e441]:
                - textbox [ref=f2e442]: "500"
              - cell [ref=f2e443]:
                - textbox [ref=f2e444]: "500"
              - cell [ref=f2e445]:
                - textbox [ref=f2e446]: "500"
              - cell [ref=f2e447]:
                - textbox [ref=f2e448]: "500"
              - cell [ref=f2e449]:
                - textbox [ref=f2e450]: "500"
              - cell [ref=f2e451]:
                - textbox [ref=f2e452]: "500"
              - cell [ref=f2e453]:
                - textbox [ref=f2e454]: "500"
              - cell [ref=f2e455]:
                - textbox [ref=f2e456]: "500"
              - cell [ref=f2e457]:
                - textbox [ref=f2e458]: "500"
              - cell [ref=f2e459]:
                - textbox [ref=f2e460]: "500"
              - cell [ref=f2e461]:
                - textbox [ref=f2e462]: "500"
              - cell [ref=f2e463]:
                - textbox [ref=f2e464]: "500"
              - cell [ref=f2e465]:
                - textbox [ref=f2e466]: "500"
              - cell [ref=f2e467]:
                - textbox [ref=f2e468]: "500"
              - cell [ref=f2e469]:
                - textbox [ref=f2e470]: "500"
              - cell [ref=f2e471]:
                - textbox [ref=f2e472]: "500"
              - cell [ref=f2e473]:
                - textbox [ref=f2e474]: "500"
              - cell [ref=f2e475]:
                - textbox [ref=f2e476]: "500"
              - cell [ref=f2e477]:
                - textbox [ref=f2e478]: "500"
              - cell [ref=f2e479]:
                - textbox [ref=f2e480]: "500"
              - cell [ref=f2e481]:
                - textbox [ref=f2e482]: "500"
              - cell [ref=f2e483]:
                - textbox [ref=f2e484]: "500"
              - cell [ref=f2e485]:
                - textbox [ref=f2e486]: "500"
              - cell [ref=f2e487]:
                - textbox [ref=f2e488]: "500"
              - cell [ref=f2e489]:
                - textbox [ref=f2e490]: "500"
              - cell [ref=f2e491]:
                - textbox [ref=f2e492]: "500"
              - cell [ref=f2e493]:
                - textbox [ref=f2e494]: "500"
              - cell [ref=f2e495]:
                - textbox [ref=f2e496]: "500"
              - cell [ref=f2e497]:
                - textbox [ref=f2e498]: "500"
              - cell [ref=f2e499]:
                - textbox [ref=f2e500]: "500"
              - cell [ref=f2e501]:
                - textbox [ref=f2e502]: "500"
              - cell [ref=f2e503]:
                - textbox [ref=f2e504]: "500"
              - cell [ref=f2e505]:
                - textbox [ref=f2e506]: "500"
              - cell [ref=f2e507]:
                - textbox [ref=f2e508]: "500"
              - cell [ref=f2e509]:
                - textbox [ref=f2e510]: "500"
              - cell [ref=f2e511]:
                - textbox [ref=f2e512]: "500"
              - cell [ref=f2e513]:
                - textbox [ref=f2e514]: "500"
              - cell [ref=f2e515]:
                - textbox [ref=f2e516]: "500"
              - cell [ref=f2e517]:
                - textbox [ref=f2e518]: "500"
              - cell [ref=f2e519]:
                - textbox [ref=f2e520]: "500"
              - cell [ref=f2e521]:
                - textbox [ref=f2e522]: "500"
              - cell [ref=f2e523]:
                - textbox [ref=f2e524]: "500"
              - cell [ref=f2e525]:
                - textbox [ref=f2e526]: "500"
              - cell [ref=f2e527]:
                - textbox [ref=f2e528]: "500"
              - cell [ref=f2e529]:
                - textbox [ref=f2e530]: "500"
              - cell [ref=f2e531]:
                - textbox [ref=f2e532]: "500"
              - cell [ref=f2e533]:
                - textbox [ref=f2e534]: "500"
              - cell [ref=f2e535]:
                - textbox [ref=f2e536]: "500"
              - cell [ref=f2e537]:
                - textbox [ref=f2e538]: "500"
              - cell [ref=f2e539]:
                - textbox [ref=f2e540]: "500"
              - cell [ref=f2e541]:
                - textbox [ref=f2e542]: "500"
              - cell [ref=f2e543]:
                - textbox [ref=f2e544]: "500"
              - cell [ref=f2e545]:
                - textbox [ref=f2e546]: "500"
              - cell [ref=f2e547]:
                - textbox [ref=f2e548]: "500"
              - cell [ref=f2e549]:
                - textbox [ref=f2e550]: "500"
              - cell [ref=f2e551]:
                - textbox [ref=f2e552]: "500"
              - cell [ref=f2e553]:
                - textbox [ref=f2e554]: "500"
              - cell [ref=f2e555]:
                - textbox [ref=f2e556]: "500"
              - cell [ref=f2e557]:
                - textbox [ref=f2e558]: "500"
              - cell [ref=f2e559]:
                - textbox [ref=f2e560]: "500"
              - cell [ref=f2e561]:
                - textbox [ref=f2e562]: "500"
              - cell [ref=f2e563]:
                - textbox [ref=f2e564]: "500"
              - cell [ref=f2e565]:
                - textbox [ref=f2e566]: "500"
              - cell [ref=f2e567]:
                - textbox [ref=f2e568]: "500"
              - cell [ref=f2e569]:
                - textbox [ref=f2e570]: "500"
              - cell [ref=f2e571]:
                - textbox [ref=f2e572]: "500"
              - cell [ref=f2e573]:
                - textbox [ref=f2e574]: "500"
              - cell [ref=f2e575]:
                - textbox [ref=f2e576]: "500"
              - cell [ref=f2e577]:
                - textbox [ref=f2e578]: "500"
              - cell [ref=f2e579]:
                - textbox [ref=f2e580]: "500"
              - cell [ref=f2e581]:
                - textbox [ref=f2e582]: "500"
              - cell [ref=f2e583]:
                - textbox [ref=f2e584]: "500"
              - cell [ref=f2e585]:
                - textbox [ref=f2e586]: "500"
              - cell [ref=f2e587]:
                - textbox [ref=f2e588]: "500"
              - cell [ref=f2e589]:
                - textbox [ref=f2e590]: "500"
              - cell [ref=f2e591]:
                - textbox [ref=f2e592]: "500"
              - cell [ref=f2e593]:
                - textbox [ref=f2e594]: "500"
              - cell [ref=f2e595]:
                - textbox [ref=f2e596]: "500"
              - cell [ref=f2e597]:
                - textbox [ref=f2e598]: "500"
              - cell [ref=f2e599]:
                - textbox [ref=f2e600]: "500"
              - cell [ref=f2e601]:
                - textbox [ref=f2e602]: "500"
              - cell [ref=f2e603]:
                - textbox [ref=f2e604]: "500"
              - cell [ref=f2e605]:
                - textbox [ref=f2e606]: "500"
              - cell [ref=f2e607]:
                - textbox [ref=f2e608]: "500"
          - rowgroup [ref=f2e609]:
            - row [ref=f2e610]:
              - cell [ref=f2e611]:
                - checkbox [ref=f2e613]
              - cell [ref=f2e614]:
                - button "" [ref=f2e616] [cursor=pointer]
              - cell "Варин Дмитрий Борисович" [ref=f2e618]
              - cell "Начальник участка" [ref=f2e619]
              - cell "Заместитель руководителя работ" [ref=f2e620]
              - cell [ref=f2e621]:
                - textbox [ref=f2e622]: "500"
              - cell [ref=f2e623]:
                - textbox [ref=f2e624]: "8"
              - cell [ref=f2e625]:
                - textbox [ref=f2e626]: "8"
              - cell [ref=f2e627]:
                - textbox [ref=f2e628]: "8"
              - cell [ref=f2e629]:
                - textbox [ref=f2e630]
              - cell [ref=f2e631]:
                - textbox [ref=f2e632]
              - cell [ref=f2e633]:
                - textbox [ref=f2e634]
              - cell [ref=f2e635]:
                - textbox [ref=f2e636]
              - cell [ref=f2e637]:
                - textbox [ref=f2e638]
              - cell [ref=f2e639]:
                - textbox [ref=f2e640]
              - cell [ref=f2e641]:
                - textbox [ref=f2e642]
              - cell [ref=f2e643]:
                - textbox [ref=f2e644]
              - cell [ref=f2e645]:
                - textbox [ref=f2e646]
              - cell [ref=f2e647]:
                - textbox [ref=f2e648]
              - cell [ref=f2e649]:
                - textbox [ref=f2e650]
              - cell [ref=f2e651]:
                - textbox [ref=f2e652]
              - cell [ref=f2e653]:
                - textbox [ref=f2e654]
              - cell [ref=f2e655]:
                - textbox [ref=f2e656]
              - cell [ref=f2e657]:
                - textbox [ref=f2e658]
              - cell [ref=f2e659]:
                - textbox [ref=f2e660]
              - cell [ref=f2e661]:
                - textbox [ref=f2e662]
              - cell [ref=f2e663]:
                - textbox [ref=f2e664]
              - cell [ref=f2e665]:
                - textbox [ref=f2e666]
              - cell [ref=f2e667]:
                - textbox [ref=f2e668]
              - cell [ref=f2e669]:
                - textbox [ref=f2e670]
              - cell [ref=f2e671]:
                - textbox [ref=f2e672]
              - cell [ref=f2e673]:
                - textbox [ref=f2e674]
              - cell [ref=f2e675]:
                - textbox [ref=f2e676]
              - cell [ref=f2e677]:
                - textbox [ref=f2e678]
              - cell [ref=f2e679]:
                - textbox [ref=f2e680]
              - cell [ref=f2e681]:
                - textbox [ref=f2e682]
              - cell [ref=f2e683]:
                - textbox [ref=f2e684]
              - cell [ref=f2e685]:
                - textbox [ref=f2e686]
              - cell [ref=f2e687]:
                - textbox [ref=f2e688]
              - cell [ref=f2e689]:
                - textbox [ref=f2e690]
              - cell [ref=f2e691]:
                - textbox [ref=f2e692]
              - cell [ref=f2e693]:
                - textbox [ref=f2e694]
              - cell [ref=f2e695]:
                - textbox [ref=f2e696]
              - cell [ref=f2e697]:
                - textbox [ref=f2e698]
              - cell [ref=f2e699]:
                - textbox [ref=f2e700]
              - cell [ref=f2e701]:
                - textbox [ref=f2e702]
              - cell [ref=f2e703]:
                - textbox [ref=f2e704]
              - cell [ref=f2e705]:
                - textbox [ref=f2e706]
              - cell [ref=f2e707]:
                - textbox [ref=f2e708]
              - cell [ref=f2e709]:
                - textbox [ref=f2e710]
              - cell [ref=f2e711]:
                - textbox [ref=f2e712]
              - cell [ref=f2e713]:
                - textbox [ref=f2e714]
              - cell [ref=f2e715]:
                - textbox [ref=f2e716]
              - cell [ref=f2e717]:
                - textbox [ref=f2e718]
              - cell [ref=f2e719]:
                - textbox [ref=f2e720]
              - cell [ref=f2e721]:
                - textbox [ref=f2e722]
              - cell [ref=f2e723]:
                - textbox [ref=f2e724]
              - cell [ref=f2e725]:
                - textbox [ref=f2e726]
              - cell [ref=f2e727]:
                - textbox [ref=f2e728]
              - cell [ref=f2e729]:
                - textbox [ref=f2e730]
              - cell [ref=f2e731]:
                - textbox [ref=f2e732]
              - cell [ref=f2e733]:
                - textbox [ref=f2e734]
              - cell [ref=f2e735]:
                - textbox [ref=f2e736]
              - cell [ref=f2e737]:
                - textbox [ref=f2e738]
              - cell [ref=f2e739]:
                - textbox [ref=f2e740]
              - cell [ref=f2e741]:
                - textbox [ref=f2e742]
              - cell [ref=f2e743]:
                - textbox [ref=f2e744]
              - cell [ref=f2e745]:
                - textbox [ref=f2e746]
              - cell [ref=f2e747]:
                - textbox [ref=f2e748]
              - cell [ref=f2e749]:
                - textbox [ref=f2e750]
              - cell [ref=f2e751]:
                - textbox [ref=f2e752]
              - cell [ref=f2e753]:
                - textbox [ref=f2e754]
              - cell [ref=f2e755]:
                - textbox [ref=f2e756]
              - cell [ref=f2e757]:
                - textbox [ref=f2e758]
              - cell [ref=f2e759]:
                - textbox [ref=f2e760]
              - cell [ref=f2e761]:
                - textbox [ref=f2e762]
              - cell [ref=f2e763]:
                - textbox [ref=f2e764]
              - cell [ref=f2e765]:
                - textbox [ref=f2e766]
              - cell [ref=f2e767]:
                - textbox [ref=f2e768]
              - cell [ref=f2e769]:
                - textbox [ref=f2e770]
              - cell [ref=f2e771]:
                - textbox [ref=f2e772]
              - cell [ref=f2e773]:
                - textbox [ref=f2e774]
              - cell [ref=f2e775]:
                - textbox [ref=f2e776]
              - cell [ref=f2e777]:
                - textbox [ref=f2e778]
              - cell [ref=f2e779]:
                - textbox [ref=f2e780]
              - cell [ref=f2e781]:
                - textbox [ref=f2e782]
              - cell [ref=f2e783]:
                - textbox [ref=f2e784]
              - cell [ref=f2e785]:
                - textbox [ref=f2e786]
              - cell [ref=f2e787]:
                - textbox [ref=f2e788]
              - cell [ref=f2e789]:
                - textbox [ref=f2e790]
              - cell [ref=f2e791]:
                - textbox [ref=f2e792]
              - cell [ref=f2e793]:
                - textbox [ref=f2e794]
              - cell [ref=f2e795]:
                - textbox [ref=f2e796]
              - cell [ref=f2e797]:
                - textbox [ref=f2e798]
              - cell [ref=f2e799]:
                - textbox [ref=f2e800]
              - cell [ref=f2e801]:
                - textbox [ref=f2e802]
              - cell [ref=f2e803]:
                - textbox [ref=f2e804]
              - cell [ref=f2e805]:
                - textbox [ref=f2e806]
              - cell "24" [ref=f2e807]
              - cell "0" [ref=f2e808]
            - row [ref=f2e809]:
              - cell [ref=f2e810]:
                - textbox [ref=f2e811]: "500"
              - cell [ref=f2e812]:
                - textbox [ref=f2e813]: "500"
              - cell [ref=f2e814]:
                - textbox [ref=f2e815]: "500"
              - cell [ref=f2e816]:
                - textbox [ref=f2e817]: "500"
              - cell [ref=f2e818]:
                - textbox [ref=f2e819]: "500"
              - cell [ref=f2e820]:
                - textbox [ref=f2e821]: "500"
              - cell [ref=f2e822]:
                - textbox [ref=f2e823]: "500"
              - cell [ref=f2e824]:
                - textbox [ref=f2e825]: "500"
              - cell [ref=f2e826]:
                - textbox [ref=f2e827]: "500"
              - cell [ref=f2e828]:
                - textbox [ref=f2e829]: "500"
              - cell [ref=f2e830]:
                - textbox [ref=f2e831]: "500"
              - cell [ref=f2e832]:
                - textbox [ref=f2e833]: "500"
              - cell [ref=f2e834]:
                - textbox [ref=f2e835]: "500"
              - cell [ref=f2e836]:
                - textbox [ref=f2e837]: "500"
              - cell [ref=f2e838]:
                - textbox [ref=f2e839]: "500"
              - cell [ref=f2e840]:
                - textbox [ref=f2e841]: "500"
              - cell [ref=f2e842]:
                - textbox [ref=f2e843]: "500"
              - cell [ref=f2e844]:
                - textbox [ref=f2e845]: "500"
              - cell [ref=f2e846]:
                - textbox [ref=f2e847]: "500"
              - cell [ref=f2e848]:
                - textbox [ref=f2e849]: "500"
              - cell [ref=f2e850]:
                - textbox [ref=f2e851]: "500"
              - cell [ref=f2e852]:
                - textbox [ref=f2e853]: "500"
              - cell [ref=f2e854]:
                - textbox [ref=f2e855]: "500"
              - cell [ref=f2e856]:
                - textbox [ref=f2e857]: "500"
              - cell [ref=f2e858]:
                - textbox [ref=f2e859]: "500"
              - cell [ref=f2e860]:
                - textbox [ref=f2e861]: "500"
              - cell [ref=f2e862]:
                - textbox [ref=f2e863]: "500"
              - cell [ref=f2e864]:
                - textbox [ref=f2e865]: "500"
              - cell [ref=f2e866]:
                - textbox [ref=f2e867]: "500"
              - cell [ref=f2e868]:
                - textbox [ref=f2e869]: "500"
              - cell [ref=f2e870]:
                - textbox [ref=f2e871]: "500"
              - cell [ref=f2e872]:
                - textbox [ref=f2e873]: "500"
              - cell [ref=f2e874]:
                - textbox [ref=f2e875]: "500"
              - cell [ref=f2e876]:
                - textbox [ref=f2e877]: "500"
              - cell [ref=f2e878]:
                - textbox [ref=f2e879]: "500"
              - cell [ref=f2e880]:
                - textbox [ref=f2e881]: "500"
              - cell [ref=f2e882]:
                - textbox [ref=f2e883]: "500"
              - cell [ref=f2e884]:
                - textbox [ref=f2e885]: "500"
              - cell [ref=f2e886]:
                - textbox [ref=f2e887]: "500"
              - cell [ref=f2e888]:
                - textbox [ref=f2e889]: "500"
              - cell [ref=f2e890]:
                - textbox [ref=f2e891]: "500"
              - cell [ref=f2e892]:
                - textbox [ref=f2e893]: "500"
              - cell [ref=f2e894]:
                - textbox [ref=f2e895]: "500"
              - cell [ref=f2e896]:
                - textbox [ref=f2e897]: "500"
              - cell [ref=f2e898]:
                - textbox [ref=f2e899]: "500"
              - cell [ref=f2e900]:
                - textbox [ref=f2e901]: "500"
              - cell [ref=f2e902]:
                - textbox [ref=f2e903]: "500"
              - cell [ref=f2e904]:
                - textbox [ref=f2e905]: "500"
              - cell [ref=f2e906]:
                - textbox [ref=f2e907]: "500"
              - cell [ref=f2e908]:
                - textbox [ref=f2e909]: "500"
              - cell [ref=f2e910]:
                - textbox [ref=f2e911]: "500"
              - cell [ref=f2e912]:
                - textbox [ref=f2e913]: "500"
              - cell [ref=f2e914]:
                - textbox [ref=f2e915]: "500"
              - cell [ref=f2e916]:
                - textbox [ref=f2e917]: "500"
              - cell [ref=f2e918]:
                - textbox [ref=f2e919]: "500"
              - cell [ref=f2e920]:
                - textbox [ref=f2e921]: "500"
              - cell [ref=f2e922]:
                - textbox [ref=f2e923]: "500"
              - cell [ref=f2e924]:
                - textbox [ref=f2e925]: "500"
              - cell [ref=f2e926]:
                - textbox [ref=f2e927]: "500"
              - cell [ref=f2e928]:
                - textbox [ref=f2e929]: "500"
              - cell [ref=f2e930]:
                - textbox [ref=f2e931]: "500"
              - cell [ref=f2e932]:
                - textbox [ref=f2e933]: "500"
              - cell [ref=f2e934]:
                - textbox [ref=f2e935]: "500"
              - cell [ref=f2e936]:
                - textbox [ref=f2e937]: "500"
              - cell [ref=f2e938]:
                - textbox [ref=f2e939]: "500"
              - cell [ref=f2e940]:
                - textbox [ref=f2e941]: "500"
              - cell [ref=f2e942]:
                - textbox [ref=f2e943]: "500"
              - cell [ref=f2e944]:
                - textbox [ref=f2e945]: "500"
              - cell [ref=f2e946]:
                - textbox [ref=f2e947]: "500"
              - cell [ref=f2e948]:
                - textbox [ref=f2e949]: "500"
              - cell [ref=f2e950]:
                - textbox [ref=f2e951]: "500"
              - cell [ref=f2e952]:
                - textbox [ref=f2e953]: "500"
              - cell [ref=f2e954]:
                - textbox [ref=f2e955]: "500"
              - cell [ref=f2e956]:
                - textbox [ref=f2e957]: "500"
              - cell [ref=f2e958]:
                - textbox [ref=f2e959]: "500"
              - cell [ref=f2e960]:
                - textbox [ref=f2e961]: "500"
              - cell [ref=f2e962]:
                - textbox [ref=f2e963]: "500"
              - cell [ref=f2e964]:
                - textbox [ref=f2e965]: "500"
              - cell [ref=f2e966]:
                - textbox [ref=f2e967]: "500"
              - cell [ref=f2e968]:
                - textbox [ref=f2e969]: "500"
              - cell [ref=f2e970]:
                - textbox [ref=f2e971]: "500"
              - cell [ref=f2e972]:
                - textbox [ref=f2e973]: "500"
              - cell [ref=f2e974]:
                - textbox [ref=f2e975]: "500"
              - cell [ref=f2e976]:
                - textbox [ref=f2e977]: "500"
              - cell [ref=f2e978]:
                - textbox [ref=f2e979]: "500"
              - cell [ref=f2e980]:
                - textbox [ref=f2e981]: "500"
              - cell [ref=f2e982]:
                - textbox [ref=f2e983]: "500"
              - cell [ref=f2e984]:
                - textbox [ref=f2e985]: "500"
              - cell [ref=f2e986]:
                - textbox [ref=f2e987]: "500"
              - cell [ref=f2e988]:
                - textbox [ref=f2e989]: "500"
              - cell [ref=f2e990]:
                - textbox [ref=f2e991]: "500"
              - cell [ref=f2e992]:
                - textbox [ref=f2e993]: "500"
    - navigation [ref=f2e994]:
      - link "" [ref=f2e995] [cursor=pointer]:
        - /url: /services/supervision/project/p_01m3vmyjc8ej1v2kktb0y5c9n8/reportcard
      - button [ref=f2e997] [cursor=pointer]:
        - img "Мое фото" [ref=f2e998]
      - button [ref=f2e999] [cursor=pointer]:
        - img "Мое фото" [ref=f2e1000]
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
  71  |         await locators.workerDayInput(name, dayIndex).fill(value);
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
> 87  |       const patched = page.waitForResponse(
      |                            ^ TimeoutError: page.waitForResponse: Timeout 9000ms exceeded while waiting for event "response"
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