import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { DatePicker } from 'primeng/datepicker';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Test component that renders multiple datepickers
@Component({
  selector: 'app-test-datepicker-performance',
  standalone: true,
  imports: [DatePicker, FormsModule],
  template: `
    <div>
      @for (item of datepickers; track item.id) {
        <p-datepicker
          [(ngModel)]="item.date"
          [showIcon]="true"
          [dateFormat]="'dd/mm/yy'">
        </p-datepicker>
      }
    </div>
  `
})
class TestDatePickerPerformanceComponent {
  datepickers: Array<{ id: number; date: Date | null }> = [];

  constructor() {
    // Initialize array with 100 datepickers
    for (let i = 0; i < 100; i++) {
      this.datepickers.push({ id: i, date: null });
    }
  }
}

describe('DatePicker Performance Test', () => {
  let component: TestDatePickerPerformanceComponent;
  let fixture: ComponentFixture<TestDatePickerPerformanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TestDatePickerPerformanceComponent,
        BrowserAnimationsModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TestDatePickerPerformanceComponent);
    component = fixture.componentInstance;
  });

  it('should measure render time for 100 datepickers', () => {
    // Mark the start of the performance test
    const startTime = performance.now();

    // Trigger change detection to start rendering
    fixture.detectChanges();

    // Wait for complete rendering
    fixture.whenStable().then(() => {
      const endTime = performance.now();
      const renderTime = endTime - startTime;

      // Log rendering time
      console.log(`\n========================================`);
      console.log(`PERFORMANCE TEST - DATEPICKER`);
      console.log(`========================================`);
      console.log(`Number of datepickers: ${component.datepickers.length}`);
      console.log(`Render time: ${renderTime.toFixed(2)}ms`);
      console.log(`Average time per datepicker: ${(renderTime / component.datepickers.length).toFixed(2)}ms`);
      console.log(`========================================\n`);

      // Verify that the component was created successfully
      expect(component).toBeTruthy();

      // Verify that all datepickers were rendered
      const datepickerElements = fixture.nativeElement.querySelectorAll('p-datepicker');
      expect(datepickerElements.length).toBe(100);

      // Add expectation to document time (can be adjusted as needed)
      // This value serves as baseline - adjust according to test hardware
      expect(renderTime).toBeLessThan(30000); // 30 seconds as reasonable maximum limit
    });
  });

  it('should measure initial render time vs subsequent change detection', async () => {
    console.log(`\n========================================`);
    console.log(`PERFORMANCE TEST - CHANGES`);
    console.log(`========================================`);

    // Initial rendering
    const startInitial = performance.now();
    fixture.detectChanges();
    await fixture.whenStable();
    const endInitial = performance.now();
    const initialRenderTime = endInitial - startInitial;

    console.log(`Initial render: ${initialRenderTime.toFixed(2)}ms`);

    // Value change in one datepicker
    const startChange = performance.now();
    component.datepickers[0].date = new Date();
    fixture.detectChanges();
    await fixture.whenStable();
    const endChange = performance.now();
    const changeDetectionTime = endChange - startChange;

    console.log(`Change detection (1 datepicker): ${changeDetectionTime.toFixed(2)}ms`);
    console.log(`Difference: ${(initialRenderTime - changeDetectionTime).toFixed(2)}ms`);
    console.log(`========================================\n`);

    // Verify that the change was faster than the initial rendering
    expect(changeDetectionTime).toBeLessThan(initialRenderTime);
  });
});
