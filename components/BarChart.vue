<script>
import { Bar, mixins } from 'vue-chartjs'
const { reactiveProp } = mixins

export default {
  /* eslint-disable vue/prop-name-casing */
  extends: Bar,
  mixins: [reactiveProp],
  // eslint-disable-next-line vue/require-prop-types
  props: ['chart-data', 'options'],
  mounted () {
    this.renderChart(this.chartData, this.options)
  },
  methods: {
    getImageData () {
      return this.$refs.canvas.toDataURL()
    }
  }
}
</script>
