import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlunoInsereComponent } from './aluno-insere.component';

describe('AlunoInsereComponent', () => {
  let component: AlunoInsereComponent;
  let fixture: ComponentFixture<AlunoInsereComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AlunoInsereComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlunoInsereComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
