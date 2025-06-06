# Projekta apraksts
"Code Moodle" ir RTU Liepājas akadēmijas Informāciajas tehnoloģiju
2.kursa studentu Kārļa Lācīša un Endija Dārznieka studiju
projekts. "Code Moodle" ir serviss programmēšanas uzdevumu
veidošanai, uzdošanai, veikšanai un labošanai. Vietne ir paredzēta
studentiem, privātskolotājiem un skolām.
# Projekta nepieciešamie rīki
- Node JS 22.14.0
- MySQL Community Server 9.2
- MySQL Workbench

# Kā palaist projektu
Sistsēma sastāv no 3 daļām, tās ir, Klienta puse, Servera puse un Datubāze.
Ir nepieciešams uzsākt datubāzes servera servisu.
Caur MySQL workbench atvērt datubāzes shēmu un lietotjot funkciju Forward Engineer izveidot datubāzi uz palaisto serveri.
Pirms sistēma tiek palaista ir nepieciešams installēt klienta puses un servera puses atkarības.
Direktorijos
`/code-moodle/sistema/kods/client/` un `/code-moodle/sistema/kods/server/`
ir jāatver powershell terminālis un japalaiž commanda
```
npm i
```
Kad atkarības ir lejupielādētas programmas ir gatavas palaišanai ar kommadu
```
npm run dev
```
Terminālī tiks uzrādīta saite kur lokāli var apmeklēt vietni
