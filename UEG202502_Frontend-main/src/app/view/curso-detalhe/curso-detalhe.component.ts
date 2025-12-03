import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { CursoInfo, CURSOS_INFO_MAP } from '../../shared/constants/cursos-info';

@Component({
  selector: 'app-curso-detalhe',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './curso-detalhe.component.html',
  styleUrl: './curso-detalhe.component.css'
})
export class CursoDetalheComponent implements OnInit, OnDestroy {
  curso?: CursoInfo;
  private sub?: Subscription;

  readonly parceirosLogos = [
    { nome: 'SECTI', descricao: 'Secretaria de Ciência, Tecnologia e Inovação', url: 'https://www.goias.gov.br/' },
    { nome: 'CP Goiás', descricao: 'Centro de Pesquisa Goiás', url: 'https://www.goias.gov.br/' },
    { nome: 'Programando o Futuro', descricao: 'Programa estadual de transformação digital', url: 'https://www.goias.gov.br/' }
  ];

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.sub = this.route.paramMap.subscribe(params => {
      const slug = params.get('slug');
      if (slug && CURSOS_INFO_MAP[slug]) {
        this.curso = CURSOS_INFO_MAP[slug];
      } else {
        this.router.navigate(['/inicio']);
      }
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}


