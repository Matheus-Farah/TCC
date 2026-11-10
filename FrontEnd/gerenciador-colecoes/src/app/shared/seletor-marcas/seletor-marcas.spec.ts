import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SeletorMarcas } from './seletor-marcas';

describe('SeletorMarcas', () => {
  let component: SeletorMarcas;
  let fixture: ComponentFixture<SeletorMarcas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeletorMarcas],
    }).compileComponents();

    fixture = TestBed.createComponent(SeletorMarcas);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
