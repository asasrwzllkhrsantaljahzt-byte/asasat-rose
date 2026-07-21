const products = [
  { sku: 'NB-330', name: 'كرتون 330 مل', units: 24, stock: 1850, reorder: 500, price: 18, cost: 10.5 },
  { sku: 'NB-600', name: 'كرتون 600 مل', units: 24, stock: 1320, reorder: 450, price: 24, cost: 14.75 },
  { sku: 'NB-1500', name: 'كرتون 1.5 لتر', units: 12, stock: 740, reorder: 260, price: 30, cost: 18.25 },
  { sku: 'NB-5L', name: 'عبوة 5 لتر', units: 4, stock: 420, reorder: 180, price: 22, cost: 13.4 }
];

const rawMaterials = [
  { name: 'رولات ليبل', stock: 168000, unit: 'ملصق', minimum: 50000 },
  { name: 'غطاء أزرق', stock: 245000, unit: 'غطاء', minimum: 80000 },
  { name: 'شرنك تغليف', stock: 740, unit: 'كجم', minimum: 220 },
  { name: 'كرتون خارجي', stock: 4350, unit: 'قطعة', minimum: 1200 }
];

const journalEntries = [
  { date: '2026-07-21', ref: 'INV-2041', account: 'الصندوق', description: 'بيع نقدي للسوق المحلي', debit: 18640, credit: 0 },
  { date: '2026-07-21', ref: 'INV-2041', account: 'مبيعات مياه معبأة', description: 'إثبات مبيعات نقدية', debit: 0, credit: 18640 },
  { date: '2026-07-21', ref: 'EXP-118', account: 'مواد تغليف', description: 'شراء شرنك وكراتين', debit: 3280, credit: 0 },
  { date: '2026-07-21', ref: 'EXP-118', account: 'البنك', description: 'سداد مورد التغليف', debit: 0, credit: 3280 },
  { date: '2026-07-20', ref: 'COL-332', account: 'البنك', description: 'تحصيل من عملاء الجملة', debit: 12400, credit: 0 },
  { date: '2026-07-20', ref: 'COL-332', account: 'ذمم العملاء', description: 'تخفيض رصيد العملاء', debit: 0, credit: 12400 }
];

const productionBatches = [
  { line: 'خط 330 مل', planned: 2200, actual: 2145, waste: 38, runtime: 7.5 },
  { line: 'خط 600 مل', planned: 1800, actual: 1768, waste: 24, runtime: 6.75 },
  { line: 'خط 1.5 لتر', planned: 960, actual: 932, waste: 18, runtime: 5.25 }
];

const customers = [
  { name: 'موزع شمال المدينة', balance: 42800, limit: 65000, due: '2026-07-28' },
  { name: 'أسواق النخبة', balance: 18250, limit: 25000, due: '2026-07-24' },
  { name: 'مؤسسة الندى', balance: 5900, limit: 18000, due: '2026-08-02' }
];

const suppliers = [
  { name: 'مصنع عبوات الخليج', payable: 36700, category: 'عبوات بلاستيك' },
  { name: 'الصفوة للتغليف', payable: 14180, category: 'كراتين وشرنك' },
  { name: 'شركة الصيانة الفنية', payable: 6200, category: 'صيانة خطوط' }
];

const formatCurrency = value => new Intl.NumberFormat('ar-SA', {
  style: 'currency',
  currency: 'SAR',
  maximumFractionDigits: 0
}).format(value);

const formatNumber = value => new Intl.NumberFormat('ar-SA').format(value);

const debitTotal = journalEntries.reduce((sum, entry) => sum + entry.debit, 0);
const creditTotal = journalEntries.reduce((sum, entry) => sum + entry.credit, 0);
const inventoryValue = products.reduce((sum, product) => sum + product.stock * product.cost, 0);
const projectedRevenue = products.reduce((sum, product) => sum + product.stock * product.price, 0);
const receivables = customers.reduce((sum, customer) => sum + customer.balance, 0);
const payables = suppliers.reduce((sum, supplier) => sum + supplier.payable, 0);
const netPosition = debitTotal - payables + receivables;

const app = document.querySelector('#app');

app.innerHTML = `
  <header class="hero">
    <nav class="topbar" aria-label="روابط النظام">
      <strong>نبع صافيا</strong>
      <span>نظام حسابات وتشغيل مصنع مياه</span>
    </nav>
    <div class="hero-content">
      <div>
        <p class="eyebrow">برنامج حسابات ويب متكامل</p>
        <h1>إدارة مالية وإنتاجية لمصنع فلترة وتعبئة مياه الشرب</h1>
        <p class="lead">تابع القيود المحاسبية، الفواتير، الذمم، الموردين، مخزون العبوات والتغليف، وكفاءة خطوط التعبئة من شاشة واحدة مصممة للعربية.</p>
        <div class="actions">
          <a href="#invoice" class="button primary">إنشاء فاتورة</a>
          <a href="#ledger" class="button secondary">مراجعة دفتر الأستاذ</a>
        </div>
      </div>
      <aside class="hero-card">
        <span>المركز النقدي التقديري</span>
        <strong>${formatCurrency(netPosition)}</strong>
        <small>يعتمد على القيود، الذمم المدينة، والالتزامات الحالية</small>
      </aside>
    </div>
  </header>

  <section class="metrics" aria-label="مؤشرات مالية رئيسية">
    ${metric('إجمالي المدين', formatCurrency(debitTotal), 'إجمالي القيود المدينة المسجلة')}
    ${metric('إجمالي الدائن', formatCurrency(creditTotal), 'مطابقة دفتر اليومية')}
    ${metric('قيمة المخزون', formatCurrency(inventoryValue), 'بسعر تكلفة الإنتاج')}
    ${metric('إيراد متوقع', formatCurrency(projectedRevenue), 'في حال بيع المخزون الجاهز')}
  </section>

  <section class="workspace">
    <article class="panel large" id="ledger">
      <div class="panel-heading">
        <div><p class="eyebrow dark">الحسابات العامة</p><h2>دفتر القيود اليومية</h2></div>
        <span class="badge ${debitTotal === creditTotal ? 'success' : 'danger'}">${debitTotal === creditTotal ? 'متوازن' : 'غير متوازن'}</span>
      </div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>التاريخ</th><th>المرجع</th><th>الحساب</th><th>البيان</th><th>مدين</th><th>دائن</th></tr></thead>
          <tbody>${journalEntries.map(entry => `
            <tr><td>${entry.date}</td><td>${entry.ref}</td><td>${entry.account}</td><td>${entry.description}</td><td>${formatCurrency(entry.debit)}</td><td>${formatCurrency(entry.credit)}</td></tr>
          `).join('')}</tbody>
        </table>
      </div>
    </article>

    <article class="panel" id="invoice">
      <div class="panel-heading">
        <div><p class="eyebrow dark">المبيعات</p><h2>فاتورة سريعة</h2></div>
        <button type="button">حفظ مسودة</button>
      </div>
      <form class="invoice-form">
        <label>العميل<select>${customers.map(customer => `<option>${customer.name}</option>`).join('')}</select></label>
        <label>المنتج<select>${products.map(product => `<option>${product.name} - ${formatCurrency(product.price)}</option>`).join('')}</select></label>
        <div class="form-row"><label>الكمية<input value="120" inputmode="numeric" /></label><label>الخصم<input value="0" inputmode="numeric" /></label></div>
        <output>الإجمالي التقديري: ${formatCurrency(120 * products[1].price)}</output>
      </form>
    </article>

    <article class="panel">
      <div class="panel-heading"><div><p class="eyebrow dark">المخزون</p><h2>المنتجات الجاهزة</h2></div><button type="button">أمر صرف</button></div>
      <div class="cards-list">${products.map(product => stockCard(product)).join('')}</div>
    </article>

    <article class="panel">
      <div class="panel-heading"><div><p class="eyebrow dark">الخامات</p><h2>مواد التعبئة والتغليف</h2></div><button type="button">طلب شراء</button></div>
      <div class="cards-list">${rawMaterials.map(material => materialCard(material)).join('')}</div>
    </article>

    <article class="panel large" id="production">
      <div class="panel-heading"><div><p class="eyebrow dark">التشغيل</p><h2>متابعة الإنتاج والهالك</h2></div><button type="button">تسجيل دفعة</button></div>
      <div class="batch-grid">${productionBatches.map(batch => productionCard(batch)).join('')}</div>
    </article>

    <article class="panel">
      <div class="panel-heading"><div><p class="eyebrow dark">العملاء</p><h2>الذمم المدينة</h2></div><span>${formatCurrency(receivables)}</span></div>
      <ul class="party-list">${customers.map(customer => customerRow(customer)).join('')}</ul>
    </article>

    <article class="panel">
      <div class="panel-heading"><div><p class="eyebrow dark">الموردون</p><h2>الذمم الدائنة</h2></div><span>${formatCurrency(payables)}</span></div>
      <ul class="party-list">${suppliers.map(supplier => supplierRow(supplier)).join('')}</ul>
    </article>
  </section>
`;

function metric(title, value, description) {
  return `<article class="metric"><span>${title}</span><strong>${value}</strong><small>${description}</small></article>`;
}

function stockCard(product) {
  const level = Math.min(100, Math.round((product.stock / (product.reorder * 4)) * 100));
  return `<div class="stock-card"><div><strong>${product.name}</strong><span>${product.sku} · ${product.units} عبوة / كرتون</span><progress value="${level}" max="100"></progress></div><b>${formatNumber(product.stock)}</b></div>`;
}

function materialCard(material) {
  const isLow = material.stock <= material.minimum * 1.25;
  return `<div class="stock-card"><div><strong>${material.name}</strong><span>الحد الأدنى ${formatNumber(material.minimum)} ${material.unit}</span></div><b class="${isLow ? 'danger-text' : ''}">${formatNumber(material.stock)} ${material.unit}</b></div>`;
}

function productionCard(batch) {
  const efficiency = Math.round((batch.actual / batch.planned) * 100);
  const cartonsPerHour = Math.round(batch.actual / batch.runtime);
  return `<div class="batch"><div class="batch-info"><strong>${batch.line}</strong><span>${efficiency}% كفاءة</span></div><progress value="${batch.actual}" max="${batch.planned}"></progress><small>${formatNumber(batch.actual)} من ${formatNumber(batch.planned)} كرتون · ${formatNumber(cartonsPerHour)} كرتون/ساعة · هالك ${batch.waste}</small></div>`;
}

function customerRow(customer) {
  const percent = Math.round((customer.balance / customer.limit) * 100);
  return `<li><span><strong>${customer.name}</strong><small>استحقاق ${customer.due} · ${percent}% من الحد الائتماني</small></span><b>${formatCurrency(customer.balance)}</b></li>`;
}

function supplierRow(supplier) {
  return `<li><span><strong>${supplier.name}</strong><small>${supplier.category}</small></span><b>${formatCurrency(supplier.payable)}</b></li>`;
}
