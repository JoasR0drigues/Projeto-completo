import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlunoAlteraComponent } from './aluno-altera.component';

describe('AlunoAlteraComponent', () => {
  let component: AlunoAlteraComponent;
  let fixture: ComponentFixture<AlunoAlteraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AlunoAlteraComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlunoAlteraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
