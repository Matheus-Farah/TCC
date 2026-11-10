import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MinhaColecao } from './minha-colecao';

describe('MinhaColecao', () => {
  let component: MinhaColecao;
  let fixture: ComponentFixture<MinhaColecao>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MinhaColecao],
    }).compileComponents();

    fixture = TestBed.createComponent(MinhaColecao);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
