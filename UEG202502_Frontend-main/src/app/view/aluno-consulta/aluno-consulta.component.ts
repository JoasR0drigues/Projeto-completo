import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Aluno } from '../../model/aluno';
import { AlunoService } from '../../service/aluno.service';

@Component({
  selector: 'app-aluno-consulta',
  standalone: false,
  templateUrl: './aluno-consulta.component.html',
  styleUrl: './aluno-consulta.component.css'
})
export class AlunoConsultaComponent implements OnInit {

  aluno!: Aluno;
  codigo!: number;

  constructor(private alunoService: AlunoService, private router: Router, private route: ActivatedRoute){}

  ngOnInit(): void {
      this.consultarAluno();
  }

  retornar(){
    this.router.navigate(['aluno-lista']);
  }

  consultarAluno(){
    this.codigo = this.route.snapshot.params['codigo'];
    this.aluno = new Aluno();
    this.alunoService.consultarAluno(this.codigo).subscribe(data => {
      this.aluno = data;
    });

  }

}
