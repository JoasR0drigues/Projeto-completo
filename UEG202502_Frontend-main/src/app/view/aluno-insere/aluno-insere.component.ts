import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Aluno } from '../../model/aluno';
import { AlunoService } from '../../service/aluno.service';

@Component({
  selector: 'app-aluno-insere',
  standalone: false,
  templateUrl: './aluno-insere.component.html',
  styleUrl: './aluno-insere.component.css'
})
export class AlunoInsereComponent {

  aluno: Aluno = new Aluno();

  constructor(private alunoService: AlunoService, private router: Router){}

  onSubmit(){
    this.inserirAluno();
  }

  inserirAluno(){
    //this.aluno.codigo = 0;
    this.alunoService.inserirAluno(this.aluno).subscribe(data =>{
      console.log(data);
      this.retornar();
    });

  }

  retornar(){
    this.router.navigate(['aluno-lista']);
  }


}
