import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BonecoDetalhe } from './boneco-detalhe';

describe('BonecoDetalhe', () => {
  let component: BonecoDetalhe;
  let fixture: ComponentFixture<BonecoDetalhe>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BonecoDetalhe],
    }).compileComponents();

    fixture = TestBed.createComponent(BonecoDetalhe);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
