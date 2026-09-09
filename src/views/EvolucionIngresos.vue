<template>
  <div class="ei-wrap">
    <div class="ei-header">
      <span class="ei-label">Panel Admin</span>
      <h1 class="ei-title">Evolución de <span class="ei-accent">Ingresos</span></h1>
      <p class="ei-sub">Ingresos netos cobrados, por mes y por año.</p>
    </div>

    <div class="ei-card">
      <div class="ei-card-body">
        <div class="ei-charts-grid">
          <div>
            <p class="ei-chart-title">Ingresos Mensuales</p>
            <VueApexCharts v-if="monthlyIncomeSeries[0]?.data.length" type="line" :options="monthlyIncomeChartOptions" :series="monthlyIncomeSeries"></VueApexCharts>
            <p v-else class="ei-empty">Sin datos mensuales.</p>
          </div>
          <div>
            <p class="ei-chart-title">Ingresos Anuales</p>
            <VueApexCharts v-if="yearlyIncomeSeries[0]?.data.length" type="bar" :options="yearlyIncomeChartOptions" :series="yearlyIncomeSeries"></VueApexCharts>
            <p v-else class="ei-empty">Sin datos anuales.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useDatabaseStore } from '../stores/database';
import VueApexCharts from 'vue3-apexcharts';
import dayjs from 'dayjs';

const databaseStore = useDatabaseStore();

const formatCurrency = (value) => {
  const numberValue = Number(value);
  if (isNaN(numberValue)) return '';
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numberValue);
};

const calculateCotizacion = (precioBruto) => {
  const brute = Number(precioBruto);
  if (isNaN(brute) || brute <= 0) return 0;
  return parseFloat((brute * 0.21).toFixed(2));
};

const calculatePrecioNeto = (precioBruto) => {
  const brute = Number(precioBruto);
  if (isNaN(brute) || brute <= 0) return 0;
  const cotizacion = calculateCotizacion(brute);
  return parseFloat((brute - cotizacion).toFixed(2));
};

const monthlyIncomeChartOptions = computed(() => ({
  chart: {
    id: 'monthly-income-chart',
    toolbar: { show: false },
    background: 'transparent',
  },
  theme: { mode: 'dark' },
  xaxis: {
    categories: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
    title: { text: 'Mes' }
  },
  yaxis: {
    title: { text: 'Ingresos Netos (€)' },
  },
  dataLabels: {
    enabled: true,
    formatter: function (val) { return formatCurrency(val); }
  },
  tooltip: {
    y: {
      formatter: function (val) { return formatCurrency(val); }
    }
  },
  grid: { borderColor: 'rgba(255,255,255,0.06)' },
  colors: ['#34d399'],
}));

const monthlyIncomeSeries = computed(() => {
  const data = Array(12).fill(0);
  databaseStore.limpiezas.forEach(limpieza => {
    if (limpieza.fechaPago && limpieza.precioBruto) {
      const month = dayjs(limpieza.fechaPago).month();
      data[month] += calculatePrecioNeto(limpieza.precioBruto);
    }
  });
  return [{ name: 'Ingresos Netos', data: data.map(val => parseFloat(val.toFixed(2))) }];
});

const yearlyIncomeDataAndCategories = computed(() => {
  const incomeByYear = {};
  let minYear = new Date().getFullYear();
  let maxYear = new Date().getFullYear();

  databaseStore.limpiezas.forEach(limpieza => {
    if (limpieza.fechaPago && limpieza.precioBruto) {
      const year = dayjs(limpieza.fechaPago).year();
      minYear = Math.min(minYear, year);
      maxYear = Math.max(maxYear, year);

      if (!incomeByYear[year]) incomeByYear[year] = 0;
      incomeByYear[year] += calculatePrecioNeto(limpieza.precioBruto);
    }
  });

  if (Object.keys(incomeByYear).length === 0 && databaseStore.limpiezas.length === 0) {
    incomeByYear[new Date().getFullYear()] = 0;
    minYear = new Date().getFullYear();
    maxYear = new Date().getFullYear();
  }
  if (!incomeByYear[new Date().getFullYear()]) {
    incomeByYear[new Date().getFullYear()] = 0;
    minYear = Math.min(minYear, new Date().getFullYear());
    maxYear = Math.max(maxYear, new Date().getFullYear());
  }

  const categories = [];
  const data = [];
  for (let year = minYear; year <= maxYear; year++) {
    categories.push(year.toString());
    data.push(parseFloat((incomeByYear[year] || 0).toFixed(2)));
  }

  return { categories, data };
});

const yearlyIncomeSeries = computed(() => {
  return [{ name: 'Ingresos Netos', data: yearlyIncomeDataAndCategories.value.data }];
});

const yearlyIncomeChartOptions = computed(() => ({
  chart: {
    id: 'yearly-income-chart',
    toolbar: { show: false },
    background: 'transparent',
  },
  theme: { mode: 'dark' },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: '55%',
      borderRadius: 4,
    },
  },
  xaxis: {
    categories: yearlyIncomeDataAndCategories.value.categories,
    title: { text: 'Año' }
  },
  yaxis: {
    title: { text: 'Ingresos Netos (€)' },
  },
  dataLabels: {
    enabled: true,
    formatter: function (val) { return formatCurrency(val); }
  },
  tooltip: {
    y: {
      formatter: function (val) { return formatCurrency(val); }
    }
  },
  grid: { borderColor: 'rgba(255,255,255,0.06)' },
  colors: ['#60a5fa'],
}));

onMounted(async () => {
  await databaseStore.fetchLimpiezas();
});
</script>

<style scoped>
.ei-wrap {
  min-height: 100vh;
  background: #080d1a;
  padding: 36px 24px 60px;
  max-width: 1100px;
  margin: 0 auto;
}
.ei-header { margin-bottom: 24px; }
.ei-label {
  display: inline-block;
  font-family: 'Raleway', sans-serif;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #60a5fa;
  background: rgba(96,165,250,0.1);
  border: 1px solid rgba(96,165,250,0.2);
  border-radius: 20px;
  padding: 3px 14px;
  margin-bottom: 10px;
}
.ei-title { font-family: 'Anton', sans-serif; font-size: 2rem; color: #f1f5f9; margin: 0 0 6px; line-height: 1.1; }
.ei-accent { color: #60a5fa; }
.ei-sub { font-family: 'Raleway', sans-serif; font-size: 0.88rem; color: #64748b; margin: 0; }

.ei-card {
  background: #0f1729;
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 16px;
}
.ei-card-body { padding: 24px 22px; }

.ei-charts-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 28px; }
.ei-chart-title { font-family: 'Raleway', sans-serif; font-size: 0.88rem; font-weight: 700; color: #94a3b8; margin-bottom: 12px; }
.ei-empty { font-family: 'Raleway', sans-serif; font-size: 0.88rem; color: #475569; padding: 12px 0; }

@media (max-width: 768px) {
  .ei-wrap { padding: 24px 12px 48px; }
  .ei-charts-grid { grid-template-columns: 1fr; }
}
</style>
