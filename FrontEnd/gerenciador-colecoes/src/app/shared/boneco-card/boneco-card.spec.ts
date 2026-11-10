import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BonecoCard } from './boneco-card';

describe('BonecoCard', () => {
  let component: BonecoCard;
  let fixture: ComponentFixture<BonecoCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BonecoCard],
    }).compileComponents();

    fixture = TestBed.createComponent(BonecoCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
