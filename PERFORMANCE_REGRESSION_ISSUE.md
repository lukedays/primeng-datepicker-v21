# Issue Title

**DatePicker performance regression from v20 to v21 - significantly slower render times**

---

# Issue Description

## Summary
There is a significant performance regression in the DatePicker component when upgrading from PrimeNG v20 to v21. Rendering multiple DatePicker instances is noticeably slower in v21.

## Environment

**PrimeNG v20:**
- PrimeNG: 20.3.0
- Angular: 20.x
- TypeScript: 5.8.3

**PrimeNG v21:**
- PrimeNG: 21.0.2
- Angular: 21.0.5
- TypeScript: 5.9.0

## Reproduction

### Test Case
Created a performance test that renders 100 DatePicker components and measures the render time.

Test code:
```typescript
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
    for (let i = 0; i < 100; i++) {
      this.datepickers.push({ id: i, date: null });
    }
  }
}
```

### Steps to Reproduce
1. Clone the test repository (or create a new Angular project)
2. Install PrimeNG v20.3.0 and Angular v20
3. Run the performance test: `npm test`
4. Note the render time for 100 datepickers
5. Upgrade to PrimeNG v21.0.2 and Angular v21
6. Run the same performance test
7. Compare the render times

## Expected Behavior
Render time should be similar or improved in v21 compared to v20.

## Actual Behavior
Render time is significantly slower in v21. The performance degradation is noticeable even in real-world applications with fewer DatePicker instances.

## Performance Impact
- **v20**: [Baseline performance]
- **v21**: Noticeably slower render times

This regression affects user experience, especially in forms with multiple date inputs or applications that dynamically render DatePicker components.

## Additional Context
The regression appears to be related to the DatePicker component itself, as other PrimeNG components don't seem to have the same level of performance degradation.

## Suggested Investigation Areas
1. Changes in the DatePicker component lifecycle between v20 and v21
2. Template rendering optimizations that may have been lost
3. Change detection strategy modifications
4. New features or functionality that may have added overhead

## Test Files
- Performance test spec: `src/app/datepicker-performance.spec.ts`
- Test can be run with: `npm test`
