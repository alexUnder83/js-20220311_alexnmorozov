import RangePicker from './components/range-picker/src/index.js';
import SortableTable from './components/sortable-table/src/index.js';
import ColumnChart from './components/column-chart/src/index.js';
import header from './bestsellers-header.js';

import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru/';

export default class Page {
  onDateSelected = (event) => {
    const { from, to } = event.detail;
    this.update(from, to);
  };

  render() {
    const div = document.createElement('div');
    div.innerHTML = this.getTemplate();
    this.element = div.firstElementChild;

    this.initComponents();
    this.subElements = this.getSubElement();

    this.renderComponents();

    this.subElements.rangePicker.addEventListener('date-select', this.onDateSelected);

    return this.element;
  }
  initComponents() {
    const to = new Date();
    const from = new Date();
    from.setMonth(to.getMonth() - 1);
    this.components = {
      rangePicker: this.createRangePicker(from, to),
      ordersChart: this.createOrdersChart(from, to),
      salesChart: this.renderSalesChart(from, to),
      customersChart: this.renderCustomersChart(from, to),
      sortableTable: this.renderSortableTable(from, to)
    };
  }
  getSubElement() {
    const result = {};
    const elements = this.element.querySelectorAll('[data-element]');
    for (const element of elements) {
      result[element.dataset.element] = element;
    }
    return result;
  }
  renderComponents() {
    for (const [name, component] of Object.entries(this.components)) {
      this.subElements[name].append(component.element);
    }
  }
  async update(from, to) {
    const promises = Object.values(this.components).reduce((total, component) => {
      if (component.update) {
        total.push(component.update(from, to));
      }
      return total;
    }, []);
    await Promise.all(promises);
  }
  createRangePicker(from, to) {
    return new RangePicker({ from, to });
  }
  createOrdersChart(from, to) {
    const result = new ColumnChart({
      label: 'Заказы',
      link: '/sales',
      url: 'api/dashboard/orders',
      range: {
        from,
        to
      }
    });
    result.element.classList.add('dashboard__chart_orders');
    return result;
  }
  renderSalesChart(from, to) {
    const result = new ColumnChart({
      label: 'Продажи',
      url: 'api/dashboard/sales',
      formatHeading: (data) => `$${(new Intl.NumberFormat('en-US')).format(data)}`,
      range: {
        from,
        to
      }
    });
    result.element.classList.add('dashboard__chart_sales');
    return result;
  }
  renderCustomersChart(from, to) {
    const result = new ColumnChart({
      label: 'Клиенты',
      url: 'api/dashboard/customers',
      range: {
        from,
        to
      }
    });
    result.element.classList.add('dashboard__chart_customers');
    return result;
  }
  renderSortableTable(from, to) {
    return new SortableTable(header, {
      isSortLocally: true,
      url: 'api/dashboard/bestsellers',
      range: {
        from,
        to
      }
    });
  }
  getTemplate() {
    return `
      <div class="dashboard">
        <div class="content__top-panel">
          <h2 class="page-title">Панель управления</h2>
          <div data-element="rangePicker"></div>
        </div>
        <div class="dashboard__charts">
          <div data-element="ordersChart"></div>
          <div data-element="salesChart"></div>
          <div data-element="customersChart"></div>
        </div>
        <h3 class="block-title">Лидеры продаж</h3>
        <div data-element="sortableTable"></div>
      </div>
    `;
  }
  remove() {
    if (this.element) {
      this.element.remove();
    }
    this.element = null;
  }
  destroy() {
    for (const component of Object.values(this.components)) {
      component.destroy();
    }
    this.remove();
  }
}
