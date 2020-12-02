
<template>
  <v-container>
    <v-card class="pa-4" width="1250">
      <v-btn color="success" large @click="generatePDF">
        Generate PDF
      </v-btn> <br>
      <h5 class="text-h4 ma-4">
        Total Profits: PHP {{ totalProfits }}
      </h5>
      <BarChart ref="chart" :chart-data="chartdata" :options="options" :height="120" />
      <BarChart ref="sellerChart" :chart-data="sellerData" :options="sellerOptions" :height="120" />
      <BarChart ref="bestsellerChart" :chart-data="bestData" :options="bestOptions" :height="120" />
    </v-card>
  </v-container>
</template>

<script>
import axios from 'axios'
import BarChart from '../components/BarChart'

export default {
  components: {
    BarChart
  },
  layout: 'Base',
  data () {
    return {
      // Total profits
      totalProfits: 0,
      // Recent data
      chartdata: null,
      options: {
        responsive: true,
        legend: { display: false },
        title: {
          display: true,
          text: 'Daily Profits (Week)',
          fontSize: 24,
          fontColor: '#6b7280'
        },
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true
              }
            }
          ]
        }
      },
      // Seller Data
      sellerData: null,
      sellerOptions: {
        responsive: true,
        legend: { display: false },
        title: {
          display: true,
          text: 'Top Employees (Week)',
          fontSize: 24,
          fontfontColor: '#6b7280'
        },
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true
              }
            }
          ]
        }
      },
      // Bestseller data
      bestData: null,
      bestOptions: {
        responsive: true,
        legend: { display: false },
        title: {
          display: true,
          text: 'Bestselling Products (Week)',
          fontSize: 24,
          fontfontColor: '#6b7280'
        },
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true
              }
            }
          ]
        }
      }
    }
  },
  mounted () {
    this.getRecentOrders()
    this.getTopCashiers()
    this.getBestSellers()
  },
  methods: {
    async getRecentOrders () {
      const res = await axios.get('/api/stats/recent')
      // this.chartdata.datasets[0].data = res.data.res
      this.chartdata = {
        labels: [
          'Sunday',
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday'
        ],
        datasets: [
          {
            label: 'Profits',
            data: res.data.res,
            backgroundColor: '#4CAF50',
            barThickness: 80
          }
        ]
      }
      for (const day of res.data.res) {
        this.totalProfits += day
      }
    },
    async getTopCashiers () {
      const res = await axios.get('/api/stats/seller')
      const keys = []
      const values = []
      for (const seller of res.data.res) {
        keys.push(seller.name)
        values.push(seller.total)
      }

      this.sellerData = {
        labels: keys,
        datasets: [
          {
            label: 'Profits',
            data: values,
            backgroundColor: '#4CAF50',
            barThickness: 80
          }
        ]
      }
    },
    async getBestSellers () {
      const res = await axios.get('/api/stats/bestsellers')
      const keys = []
      const values = []
      for (const item of res.data.res) {
        keys.push(item.name)
        values.push(item.sold)
      }
      this.bestData = {
        labels: keys,
        datasets: [
          {
            label: 'Items Sold',
            data: values,
            backgroundColor: '#4CAF50',
            barThickness: 80
          }
        ]
      }
    },
    async generatePDF () {
      const user = await axios.get(`/api/user/search?id=${this.$cookies.get('active-user').id}`)
      const gen = user.data.res.lastname + ', ' + user.data.res.firstname
      const data = {
        generator: gen,
        total: this.totalProfits,
        profitChart: this.$refs.chart.getImageData(),
        sellerChart: this.$refs.sellerChart.getImageData(),
        bestChart: this.$refs.bestsellerChart.getImageData()
      }

      // eslint-disable-next-line no-unused-vars
      const res = await axios.post('/api/stats/pdf', data)
      if (res.status === 204) {
        window.open('/api/stats/finishedpdf', '_blank')
      }
    }
  }
}
</script>

<style>

</style>
