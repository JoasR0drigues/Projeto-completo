import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Aluno } from '../../model/aluno';
import { AlunoService } from '../../service/aluno.service';

@Component({
  selector: 'app-aluno-form',
  templateUrl: './aluno-form.component.html',
  styleUrls: ['./aluno-form.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class AlunoFormComponent implements OnInit {

  form!: FormGroup;
  titulo = 'Novo Aluno';
  idEdicao?: number;
  salvando = false;
  erro = '';

  constructor(
    private fb: FormBuilder,
    private service: AlunoService,
    private route: ActivatedRoute,
    private router: Router
  ){}

  ngOnInit(): void {
    this.form = this.fb.group({
      codigo: [{value: '', disabled: true}],
      nome: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      curso: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      dataMatricula: ['', [Validators.required]],
      mensalidade: [0, [Validators.required, Validators.min(0.01)]],
      bolsista: [false],
      semestre: [1, [Validators.required, Validators.min(1), Validators.max(10)]]
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.idEdicao = +id;
      this.titulo = 'Editar Aluno';
      this.service.consultarAluno(this.idEdicao).subscribe({
        next: (data) => {
          // Converter data para o formato esperado pelo input date
          if (data.dataMatricula) {
            const dataFormatada = new Date(data.dataMatricula).toISOString().split('T')[0];
            this.form.patchValue({
              ...data,
              dataMatricula: dataFormatada
            });
          } else {
            this.form.patchValue(data);
          }
        },
        error: () => this.erro = 'Não foi possível carregar o registro.'
      });
    }
  }

  salvar(){
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.salvando = true;
    this.erro = '';

    const formValue = this.form.getRawValue();
    const payload: Aluno = {
      ...formValue,
      codigo: this.idEdicao ? Number(this.idEdicao) : undefined,
      dataMatricula: new Date(formValue.dataMatricula),
      bolsista: Boolean(formValue.bolsista)
    };

    const req = this.idEdicao
      ? this.service.alterarAluno(this.idEdicao, payload)
      : this.service.inserirAluno(payload);

    req.subscribe({
      next: () => this.router.navigate(['/alunos']),
      error: (error) => { 
        this.erro = 'Falha ao salvar: ' + (error.error?.message || 'Erro desconhecido');
        this.salvando = false; 
      }
    });
  }

  cancelar(){
    this.router.navigate(['/alunos']);
  }

  // Método para verificar se um campo tem erro
  temErro(campo: string): boolean {
    const control = this.form.get(campo);
    return !!(control && control.invalid && control.touched);
  }

  // Método para obter mensagem de erro específica
  getMensagemErro(campo: string): string {
    const control = this.form.get(campo);
    if (control?.errors) {
      if (control.errors['required']) return `${campo} é obrigatório`;
      if (control.errors['minlength']) return `${campo} deve ter pelo menos ${control.errors['minlength'].requiredLength} caracteres`;
      if (control.errors['maxlength']) return `${campo} deve ter no máximo ${control.errors['maxlength'].requiredLength} caracteres`;
      if (control.errors['min']) return `${campo} deve ser maior que ${control.errors['min'].min}`;
      if (control.errors['max']) return `${campo} deve ser menor que ${control.errors['max'].max}`;
    }
    return '';
  }
}
