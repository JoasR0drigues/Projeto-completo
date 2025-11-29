import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Aluno } from '../../model/aluno';
import { AlunoService } from '../../service/aluno.service';
import { CURSOS_SUKATECH } from '../../shared/constants/cursos.const';

@Component({
  selector: 'app-aluno-altera',
  standalone: false,
  templateUrl: './aluno-altera.component.html',
  styleUrl: './aluno-altera.component.css'
})
export class AlunoAlteraComponent implements OnInit {

  codigo!: number;
  aluno!: Aluno;
  readonly cursos = CURSOS_SUKATECH;

  constructor(private alunoService: AlunoService,
    private router: Router,
    private route: ActivatedRoute
  ){}

  ngOnInit(): void {
    this.consultarAluno();  
  }

  onSubmit(){
    this.alunoService.alterarAluno(this.codigo, this.aluno).subscribe(data =>{
      console.log(data);
      this.retornar();
    });
  }


  consultarAluno(){
    this.codigo = this.route.snapshot.params['codigo'];
    this.aluno = new Aluno();
    this.alunoService.consultarAluno(this.codigo).subscribe(data =>{
      this.aluno = data;
    });
  }

  retornar(){
    this.router.navigate(['aluno-lista']);
  }

}
