import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { QuestionsService } from '../../questions.service';
import { QuestionSteps } from 'src/app/core/enums/question-steps.enum';
import { UserService } from 'src/app/core/services/user.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { switchMap, tap } from 'rxjs';
import { User } from 'src/app/core/models/user';

@Component({
  selector: 'app-income',
  templateUrl: './income.component.html',
  styleUrls: ['./income.component.scss']
})
export class IncomeComponent implements OnInit {
  public incomeGroup = new FormGroup({
    income: new FormControl('')
  });

  constructor(private questionsService: QuestionsService,
              private userService: UserService,
              private afAuth: AngularFireAuth
  ) {}

  ngOnInit() {
    if(!this.questionsService.user)
      this.afAuth.authState.pipe(
        switchMap(user => this.userService.getUser(user!.uid)),
        tap(user => this.questionsService.user = user as User)
      ).subscribe({error: error => console.error(error)});

    if(this.questionsService.income) {
      this.incomeGroup.get('income')?.setValue(`${this.questionsService.income.amount}`);
    }
  }
  
  public onClickNext() {
    this.questionsService.setIncome(Number(this.income));
    this.questionsService.activeStep = QuestionSteps.SavedAmount;
  }

  public get income() {
    return this.incomeGroup.get('income')?.value;
  }
}
