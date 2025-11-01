import { Component, Input, OnInit } from '@angular/core';
import { SpendingCategoriesName } from 'src/app/core/enums/spending-categories-name.enum';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})

export class DetailsComponent implements OnInit {
  @Input() activeCategory!: SpendingCategoriesName;
  public details: string[] = [];

  constructor() {}

  ngOnInit(): void {
    this.setDetails();
  }

  private setDetails() {
    switch(this.activeCategory) {
      case SpendingCategoriesName.HousingAndUtilities:
        this.details.push("Lakbér/hiteltörlesztő");
        this.details.push("Közös költség");
        this.details.push("Villany");
        this.details.push("Gáz/fűtés");
        this.details.push("Víz, csatorna");
        this.details.push("Internet");
        this.details.push("TV/streaming szolgáltatások");
        this.details.push("Lakásbiztosítás");
        break;
      case SpendingCategoriesName.Transportation:
        this.details.push("Autóhitel/lízing");
        this.details.push("Benzin, gázolaj, töltés");
        this.details.push("Autóbiztosítás (kötelező, casco)");
        this.details.push("Szerviz, javítás, alkatrészek");
        this.details.push("Parkolás, útidíj, autópálya matrica");
        this.details.push("BKV/MÁV/buszbérlet");
        this.details.push("Kerékpárköltségek");
        break;
      case SpendingCategoriesName.FoodAndHousehold:
        this.details.push("Bevásárlás (élelmiszer, drogéria)");
        this.details.push("Piac/bio/prémium termékek");
        this.details.push("Étterem, gyorsétterem, kávézók");
        this.details.push("Kiszállítás (Wolt, Foodora stb.)");
        this.details.push("Háztartási eszközök, tisztítószerek");
        break;
      case SpendingCategoriesName.HealthAndPersonalExpenses:
        this.details.push("Gyógyszerek, vitaminok");
        this.details.push("Magánorvos, fogászat, szemüveg stb.)");
        this.details.push("Egészségbiztosítás");
        this.details.push("Kozmetikumok, szépségápolás");
        this.details.push("Fodrász, kozmetikus");
        this.details.push("Fitness bérlet, sport, wellness");
        break;
      case SpendingCategoriesName.ClothingAndOtherShopping:
        this.details.push("Ruhák, cipők");
        this.details.push("Kiegészítők (táska, ékszer)");
        this.details.push("Elektronikai eszközök");
        this.details.push("Bútor, lakberendezés");
        this.details.push("Hobbihoz szükséges tárgyak");
        break;
      case SpendingCategoriesName.EntertainmentAndLeisure:
        this.details.push("Streaming (Netflix, Spotify, HBO stb.");
        this.details.push("Könyvek, újságok, játékok");
        this.details.push("Mozi, színház, koncert, rendezvények");
        this.details.push("Utazás, nyaralás");
        this.details.push("Hobbi (pl. sportfelszerelés, művészeti anyagok)");
        break;
      case SpendingCategoriesName.ChildrenPerFamily:
        this.details.push("Gyereknevelés költségei (étel, ruha, pelenka, játékok)");
        this.details.push("Iskolai, óvodai díjak");
        this.details.push("Plusz foglalkozások (nyelvóra, sport, zene)");
        this.details.push("Táborok");
        this.details.push("Zsebpénz");
        break;
      case SpendingCategoriesName.LoansAndDebts:
        this.details.push("Személyi kölcsön");
        this.details.push("Hitelkártya törlesztés");
        this.details.push("Diákhitel");
        this.details.push("Egyéb tartozások");
        break;
      case SpendingCategoriesName.InsuranceAndFinancialProducts:
        this.details.push("Életbiztosítás");
        this.details.push("Nyugdíjbiztosítás");
        this.details.push("Lakás-, autó-, utasbiztosítás");
        this.details.push("Befektetési alapok, állampapír");
        this.details.push("Banki számlavezetési díj, kártyadíj");
        break;
      case SpendingCategoriesName.SavingAndInvesting:
        this.details.push("Vésztartalék, félretett pénz");
        this.details.push("Nyugdíj megtakarítás");
        this.details.push("Célzott megtakarítás (pl. lakás, autó, utazás)");
        this.details.push("Rendszeres befektetés");
        break;
      case SpendingCategoriesName.OtherPerVariableExpenses:
        this.details.push("Ajándékok, ünnepek, születésnapok");
        this.details.push("Adományok, jótékonykosáa");
        this.details.push("Kisállatok (eledel, állatorvos)");
        this.details.push("Nem tervezett költségek (pl. elromlik valami)");
        break;
    }
  }
}
