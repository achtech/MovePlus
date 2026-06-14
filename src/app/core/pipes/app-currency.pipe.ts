import { Pipe, PipeTransform } from '@angular/core';
import { APP_CURRENCY_LOCALE, APP_CURRENCY_SYMBOL } from '../constants/currency.config';

@Pipe({
  name: 'appCurrency',
  standalone: true
})
export class AppCurrencyPipe implements PipeTransform {
  transform(value: number | string | null | undefined): string {
    if (value == null || value === '') {
      return '';
    }

    const amount = Number(value);
    if (isNaN(amount)) {
      return '';
    }

    const formatted = new Intl.NumberFormat(APP_CURRENCY_LOCALE, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);

    return `${formatted} ${APP_CURRENCY_SYMBOL}`;
  }
}
